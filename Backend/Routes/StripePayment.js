const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { User, Tool } = require("../DB/db_models");

// Log Stripe key status (without exposing the key)
console.log('Stripe key configured:', !!process.env.STRIPE_SECRET_KEY);

const authentication = require("../Middlewares/Authentication");

// PKR to USD conversion rate (you should update this regularly)
const PKR_TO_USD = 0.0036;

router.post("/create-checkout-session", async (req, res) => {
  try {
    console.log('Received payment request:', {
      toolId: req.body.toolId,
      userId: req.body.userId,
      toolName: req.body.toolName,
      toolPrice: req.body.toolPrice,
      rentalDays: req.body.rentalDays
    });

    // Validate required fields
    if (!req.body.toolId || !req.body.userId || !req.body.toolName || !req.body.toolPrice || !req.body.rentalDays) {
      console.error('Missing required fields:', {
        toolId: !!req.body.toolId,
        userId: !!req.body.userId,
        toolName: !!req.body.toolName,
        toolPrice: !!req.body.toolPrice,
        rentalDays: !!req.body.rentalDays
      });
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Find the tool
    const tool = await Tool.findById(req.body.toolId);
    if (!tool) {
      console.error('Tool not found:', req.body.toolId);
      return res.status(404).json({ error: "Tool not found" });
    }

    // Check if tool is available
    if (tool.rented) {
      console.error('Tool is already rented:', req.body.toolId);
      return res.status(400).json({ error: "Tool is not available for rent" });
    }

    // Convert PKR to USD and ensure minimum amount
    const priceInPKR = Number(req.body.toolPrice);
    const priceInUSD = priceInPKR * PKR_TO_USD;
    
    if (priceInUSD < 0.50) {
      console.error('Amount too low:', { priceInPKR, priceInUSD });
      return res.status(400).json({ 
        error: "Payment amount too low. Minimum amount is 50 cents USD (approximately 140 PKR)." 
      });
    }

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd", // Changed to USD for Stripe
            product_data: {
              name: req.body.toolName,
              description: `Rental for ${req.body.toolName} (${req.body.rentalDays} days)`
            },
            unit_amount: Math.round(priceInUSD * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/dashboard?payment=cancelled`,
      metadata: {
        toolId: req.body.toolId,
        userId: req.body.userId,
        originalPricePKR: priceInPKR,
        rentalDays: req.body.rentalDays
      },
    });

    console.log('Stripe session created successfully:', session.id);
    
    // TEMPORARY WORKAROUND: Mark the tool as rented immediately after successful payment
    // This is a backup in case the webhook doesn't work properly
    try {
      // Calculate rental dates
      const rentalStartDate = new Date();
      const rentalEndDate = new Date();
      rentalEndDate.setDate(rentalEndDate.getDate() + parseInt(req.body.rentalDays || 7));
      
      // Find and update the tool
      const tool = await Tool.findById(req.body.toolId);
      if (tool && !tool.rented) {
        tool.rented = true;
        tool.rentedTo = {
          user: req.body.userId,
          rentedAt: rentalStartDate,
          rentedUntil: rentalEndDate
        };
        await tool.save();
        console.log(`MANUAL UPDATE: Tool ${req.body.toolId} marked as rented`);
        
        // Update user's rental information
        const user = await User.findById(req.body.userId);
        if (user) {
          // Add to rented tools if not already there
          const alreadyRented = user.toolsRented.some(
            rental => rental.tool.toString() === req.body.toolId
          );
          
          if (!alreadyRented) {
            user.toolsRented.push({
              tool: req.body.toolId,
              rentedAt: rentalStartDate,
              rentedUntil: rentalEndDate
            });
          }
          
          // Update existing request or create new one
          const requestIndex = user.toolsRequested.findIndex(
            request => request.tool.toString() === req.body.toolId && request.status === 'pending'
          );
          
          if (requestIndex !== -1) {
            user.toolsRequested[requestIndex].status = 'accepted';
          } else {
            user.toolsRequested.push({
              tool: req.body.toolId,
              status: 'accepted'
            });
          }
          
          await user.save();
          console.log(`MANUAL UPDATE: User ${req.body.userId} rental info updated`);
        }
      }
    } catch (error) {
      console.error('Error in manual tool update:', error);
      // Continue anyway - we don't want to block the payment process
    }
    
    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook to handle successful payments
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    console.log('------------------------');
    console.log('Webhook endpoint hit at:', new Date().toISOString());
    console.log('Headers:', JSON.stringify(req.headers));
    
    let event;
    const signature = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    try {
        // Verify the webhook signature
        if (!signature || !endpointSecret) {
            console.error('Missing signature or endpoint secret');
            console.error('Signature:', signature);
            console.error('Endpoint Secret:', endpointSecret ? 'Present' : 'Missing');
            return res.status(400).send('Webhook signature verification failed');
        }

        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                signature,
                endpointSecret
            );
            console.log('Webhook verified, event type:', event.type);
            console.log('Event ID:', event.id);
        } catch (err) {
            console.error('Webhook signature verification failed:', err.message);
            console.error('Signature:', signature);
            console.error('Endpoint Secret:', endpointSecret ? 'Present (length: ' + endpointSecret.length + ')' : 'Missing');
            console.error('Request body size:', req.body.length);
            return res.status(400).send(`Webhook signature verification failed: ${err.message}`);
        }

        // Handle the checkout.session.completed event
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            console.log('Payment succeeded, session ID:', session.id);
            console.log('Session data:', JSON.stringify({
                id: session.id,
                payment_status: session.payment_status,
                status: session.status,
                customer: session.customer,
                amount_total: session.amount_total
            }));
            console.log('Session metadata:', JSON.stringify(session.metadata));

            // Extract metadata
            const toolId = session.metadata.toolId;
            const userId = session.metadata.userId;
            const rentalDays = parseInt(session.metadata.rentalDays) || 7;

            if (!toolId || !userId) {
                console.error('Missing required metadata:', { toolId, userId });
                return res.status(400).send('Missing required metadata');
            }

            console.log(`Processing payment for tool: ${toolId} and user: ${userId}`);

            try {
                // Calculate rental dates
                const rentalStartDate = new Date();
                const rentalEndDate = new Date();
                rentalEndDate.setDate(rentalEndDate.getDate() + rentalDays);

                // IMPORTANT: First check if tool exists and is not already rented
                const tool = await Tool.findById(toolId);
                if (!tool) {
                    console.error(`Tool not found: ${toolId}`);
                    return res.status(200).send();
                }

                if (tool.rented) {
                    console.log(`Tool ${toolId} is already rented, skipping update`);
                    return res.status(200).send();
                }

                // Update the tool - DIRECT update with save() for reliability
                tool.rented = true;
                tool.rentedTo = {
                    user: userId,
                    rentedAt: rentalStartDate,
                    rentedUntil: rentalEndDate
                };

                const savedTool = await tool.save();
                console.log(`Tool ${toolId} marked as rented:`, savedTool.rented);

                // Get the user who paid
                const user = await User.findById(userId);
                if (!user) {
                    console.error(`User not found: ${userId}`);
                    return res.status(200).send();
                }

                // Check if the user has a pending request for this tool
                const requestIndex = user.toolsRequested.findIndex(request => 
                    request.tool.toString() === toolId && request.status === 'pending'
                );

                if (requestIndex !== -1) {
                    // Update existing request
                    user.toolsRequested[requestIndex].status = 'accepted';
                    console.log(`Updated existing request for tool ${toolId} to accepted`);
                } else {
                    // Create a new accepted request
                    user.toolsRequested.push({
                        tool: toolId,
                        status: 'accepted'
                    });
                    console.log(`Created new accepted request for tool ${toolId}`);
                }

                // Add the tool to user's rented tools if not already there
                const alreadyRented = user.toolsRented.some(
                    rental => rental.tool.toString() === toolId
                );

                if (!alreadyRented) {
                    user.toolsRented.push({
                        tool: toolId,
                        rentedAt: rentalStartDate,
                        rentedUntil: rentalEndDate
                    });
                    console.log(`Added tool ${toolId} to user's rented tools`);
                }

                await user.save();
                console.log(`User ${userId} record updated`);

                // Make sure the tool owner has this tool in their toolsUploaded array
                if (tool.owner) {
                    const owner = await User.findById(tool.owner);
                    if (owner) {
                        const hasToolUploaded = owner.toolsUploaded.some(
                            t => t.toString() === toolId
                        );

                        if (!hasToolUploaded) {
                            owner.toolsUploaded.push(toolId);
                            await owner.save();
                            console.log(`Added tool ${toolId} to owner's uploaded tools`);
                        }
                    }
                }

                console.log('Payment processing completed successfully');
            } catch (error) {
                console.error('Error processing payment:', error);
            }
        }

        // Return a 200 response to acknowledge receipt of the event
        res.status(200).send();
    } catch (err) {
        console.error('General webhook error:', err);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
});

// Diagnostic endpoint to check webhook configuration
router.get('/webhook-status', async (req, res) => {
    try {
        const webhooks = await stripe.webhookEndpoints.list({
            limit: 10,
        });
        
        // Filter out sensitive data
        const sanitizedWebhooks = webhooks.data.map(webhook => ({
            id: webhook.id,
            url: webhook.url,
            status: webhook.status,
            enabled_events: webhook.enabled_events,
            api_version: webhook.api_version,
            created: new Date(webhook.created * 1000).toISOString(),
            livemode: webhook.livemode
        }));
        
        const config = {
            webhooks: sanitizedWebhooks,
            environment: {
                STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? 'Configured' : 'Missing',
                STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ? 'Configured' : 'Missing',
                NODE_ENV: process.env.NODE_ENV,
                SERVER_URL: process.env.FRONTEND_URL
            }
        };
        
        res.json({
            success: true,
            message: 'Stripe webhook configuration',
            config
        });
    } catch (error) {
        console.error('Error fetching webhook status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch webhook status',
            error: error.message
        });
    }
});

module.exports = router;

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
    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook to handle successful payments
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        
        try {
            // Calculate rental end date
            const rentalStartDate = new Date();
            const rentalEndDate = new Date();
            rentalEndDate.setDate(rentalEndDate.getDate() + parseInt(session.metadata.rentalDays));

            // Update tool status
            await Tool.findByIdAndUpdate(session.metadata.toolId, {
                rented: true,
                rentedTo: {
                    user: session.metadata.userId,
                    rentedAt: rentalStartDate,
                    rentedUntil: rentalEndDate
                }
            });

            // Create rental record
            await User.findByIdAndUpdate(session.metadata.userId, {
                $push: {
                    toolsRented: {
                        tool: session.metadata.toolId,
                        rentedAt: rentalStartDate,
                        rentedUntil: rentalEndDate
                    }
                }
            });

            console.log('Payment successful and rental created');
        } catch (error) {
            console.error('Error updating rental status:', error);
        }
    }

    res.json({ received: true });
});

module.exports = router;

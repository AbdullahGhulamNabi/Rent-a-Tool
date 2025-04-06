const { Router } = require("express");
const mongoose = require("mongoose");
const router = Router();
const { User , Tool, FeedBack } = require("../DB/db_models");
const authentication = require("../Middlewares/Authentication");


router.get("/getToolCount", authentication, async (req, res) => {
    try {
    
        const user = await User.findOne({ email: req.email });
        if (!user) {
            return res.status(404).json({ msg: "User not found!" });
        }

        res.json({ success: true, toolCount: user.toolsUploaded.length });
    } catch (error) {
        res.status(500).json({ msg: "Error fetching tool count", error });
    }
});

  router.get("/getRentalCount", authentication, async (req, res) => {
    try {
    
        const user = await User.findOne({ email: req.email });
        if (!user) {
            return res.status(404).json({ msg: "User not found!" });
        }

        res.json({ success: true, toolRentalCount: ((user.toolsRented.length) + (user.toolsRequested.length)) });
    } catch (error) {
        res.status(500).json({ msg: "Error fetching tool rental count", error });
    }
});


  router.get("/getPendingRequestCount", authentication, async (req, res) => {
    try {
    
        const user = await User.findOne({ email: req.email });
        if (!user) {
            return res.status(404).json({ msg: "User not found!" });
        }

        const pendingCount = user.toolsRequested.filter(request => request.status === "pending").length;

      
        res.json({ success: true, pendingRequests: pendingCount });
    } catch (error) {
        res.status(500).json({ msg: "Error fetching tool rental count", error });
    }
});


  router.post("/addToolInUploadedList", authentication,async (req, res) => {
    try {
      const user        = await User.findOne({ email: req.email });
      const toolId      = req.body.toolId
      const ToolId      = String(toolId);

      if (!mongoose.isValidObjectId(ToolId)) {
          return res.status(400).json({ msg: "Invalid Tool ID format!" });
      }

      const toolObjectId = new mongoose.Types.ObjectId(ToolId);

      if (user.toolsUploaded.includes(toolObjectId)) {
        return res.status(400).json({ msg: "Tool already exists in uploaded list!" });
      }

      user.toolsUploaded.push(toolObjectId);
      await user.save();
      return res.status(200).json({ msg: "Tool added successfully!", user });

    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  });

router.get("/getUserRequests", authentication, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.email })
            .populate({
                path: 'toolsRequested.tool',
                select: 'name description price image owner',
                populate: {
                    path: 'owner',
                    select: 'firstName lastName email address postalCode'
                }
            });
        
        if (!user) {
            return res.status(404).json({ msg: "User not found!" });
        }

        // Transform the requests and filter out any with null tools
        const requests = user.toolsRequested
            .filter(request => request.tool !== null)
            .map(request => ({
                _id: request._id,
                tool: request.tool,
                status: request.status,
                createdAt: request.createdAt
            }));

        res.json({ success: true, requests });
    } catch (error) {
        console.error("Error fetching user requests:", error);
        res.status(500).json({ msg: "Error fetching user requests", error });
    }
});

router.get("/getToolRequests", authentication, async (req, res) => {
    try {
        console.log("Fetching tool requests for:", req.email);
        
        // Find the user and populate their uploaded tools
        const user = await User.findOne({ email: req.email });
        if (!user) {
            return res.status(404).json({ success: false, msg: "User not found!" });
        }

        // Log the user's uploaded tools for debugging
        console.log("User uploaded tools:", user.toolsUploaded.length);

        // Simple approach: Find all users with tool requests and check each request manually
        // Get all users with any tool requests
        const allRequesters = await User.find({
            'toolsRequested.tool': { $in: user.toolsUploaded }
        }).select('firstName lastName email phoneNumber toolsRequested');
        
        console.log("Found requesters:", allRequesters.length);
        
        // Process the requests to include only pending ones for this user's tools
        const pendingRequests = [];
        let totalRequests = 0;
        let pendingCount = 0;
        let acceptedCount = 0;
        let rejectedCount = 0;
        
        for (const requester of allRequesters) {
            for (const request of requester.toolsRequested) {
                if (!request.tool) continue;
                totalRequests++;
                
                // Debug the status of each request
                const toolId = request.tool.toString();
                const isUsersTool = user.toolsUploaded.some(id => id.toString() === toolId);
                
                if (isUsersTool) {
                    console.log(`Request status for tool ${toolId.substring(0, 6)}... is: ${request.status}`);
                    
                    // Track counts by status
                    if (request.status === 'pending') pendingCount++;
                    if (request.status === 'accepted') acceptedCount++;
                    if (request.status === 'rejected') rejectedCount++;
                    
                    // Only proceed if this is a pending request for a tool owned by this user
                    if (request.status === 'pending') {
                        // Get tool details
                        const tool = await Tool.findOne({
                            _id: request.tool,
                            owner: user._id
                        }).select('name description price image');
                        
                        if (tool) {
                            pendingRequests.push({
                                _id: request._id,
                                status: request.status,
                                tool: {
                                    _id: tool._id,
                                    name: tool.name,
                                    description: tool.description,
                                    price: tool.price,
                                    image: tool.image
                                },
                                requester: {
                                    _id: requester._id,
                                    firstName: requester.firstName,
                                    lastName: requester.lastName,
                                    email: requester.email,
                                    phoneNumber: requester.phoneNumber
                                }
                            });
                        }
                    }
                }
            }
        }

        console.log(`Request stats - Total: ${totalRequests}, Pending: ${pendingCount}, Accepted: ${acceptedCount}, Rejected: ${rejectedCount}`);
        console.log("Final pending requests:", pendingRequests.length);
        
        res.json({ success: true, requests: pendingRequests });
    } catch (error) {
        console.error("Error fetching tool requests:", error);
        res.status(500).json({ success: false, msg: "Error fetching tool requests", error });
    }
});

router.post("/updateRequestStatus", authentication, async (req, res) => {
    try {
        console.log("Updating request status with:", req.body);
        const { requesterId, toolId, status } = req.body;

        if (!requesterId || !toolId || !status) {
            return res.status(400).json({ 
                success: false, 
                msg: "Missing required fields" 
            });
        }

        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ 
                success: false, 
                msg: "Invalid status. Must be 'accepted' or 'rejected'" 
            });
        }

        // Find the tool owner (current user)
        const owner = await User.findOne({ email: req.email });
        if (!owner) {
            return res.status(404).json({ success: false, msg: "Owner not found" });
        }

        // Verify the tool belongs to the owner
        const tool = await Tool.findOne({ _id: toolId, owner: owner._id });
        if (!tool) {
            return res.status(403).json({ 
                success: false, 
                msg: "You don't have permission to manage this tool" 
            });
        }

        // Find the requester
        const requester = await User.findById(requesterId);
        if (!requester) {
            return res.status(404).json({ success: false, msg: "Requester not found" });
        }

        // Find the request in the requester's toolsRequested array
        const requestIndex = requester.toolsRequested.findIndex(
            request => request.tool.toString() === toolId
        );

        if (requestIndex === -1) {
            return res.status(404).json({ 
                success: false, 
                msg: "Request not found" 
            });
        }

        console.log("Found request at index:", requestIndex);
        console.log("Current status before action:", requester.toolsRequested[requestIndex].status);
        console.log("Action being taken:", status);

        if (status === 'accepted') {
            // Update request status to accepted
            requester.toolsRequested[requestIndex].status = 'accepted';
            await requester.save();
            
            // Update tool status
            tool.rented = true;
            tool.rentedTo = {
                user: requesterId,
                rentedAt: new Date()
            };
            await tool.save();
            
            // Check if the tool is in the owner's toolsUploaded array
            const ownerToolIndex = owner.toolsUploaded.findIndex(
                id => id.toString() === toolId
            );
            
            if (ownerToolIndex === -1) {
                // Add the tool to the owner's toolsUploaded array if it's not already there
                owner.toolsUploaded.push(toolId);
                await owner.save();
            }
        } else if (status === 'rejected') {
            // Remove the request entirely instead of just updating status
            requester.toolsRequested.splice(requestIndex, 1);
            await requester.save();
            console.log("Request removed from user's toolsRequested array");
        }

        // Verify the update
        const verifyUser = await User.findById(requesterId);
        if (status === 'rejected') {
            const requestStillExists = verifyUser.toolsRequested.some(r => r.tool.toString() === toolId);
            console.log("Request still exists after removal:", requestStillExists);
        } else {
            const verifyRequest = verifyUser.toolsRequested.find(r => r.tool.toString() === toolId);
            console.log("Verified status after update:", verifyRequest ? verifyRequest.status : "request not found");
        }

        res.json({ 
            success: true, 
            msg: status === 'accepted' 
                ? "Request accepted successfully" 
                : "Request rejected and removed successfully" 
        });
    } catch (error) {
        console.error("Error updating request status:", error);
        res.status(500).json({ 
            success: false, 
            msg: "Error updating request status", 
            error 
        });
    }
});

// Add a new endpoint to get user rentals
router.get("/getUserRentals", authentication, async (req, res) => {
  try {
    console.log(`Fetching rental history for user: ${req.email}`);
    
    const user = await User.findOne({ email: req.email })
      .populate({
        path: 'toolsRented.tool',
        populate: {
          path: 'owner',
          select: 'firstName lastName email'
        }
      });

    if (!user) {
      console.log('User not found');
      return res.status(404).json({
        success: false,
        msg: "User not found"
      });
    }

    if (!user.toolsRented || !Array.isArray(user.toolsRented)) {
      console.log('User has no toolsRented array');
      return res.status(200).json({
        success: true,
        rentals: []
      });
    }

    console.log(`User has ${user.toolsRented.length} rental records in database`);

    // Format the rentals data and include status based on returnedAt field
    const rentals = user.toolsRented
      .filter(rental => rental.tool) // Filter out any null tools
      .map(rental => {
        // Determine the status
        const status = rental.returnedAt ? 'returned' : 'active';
        
        // Check if the tool is actually marked as rented to this user in the Tools collection
        let toolStatus = 'unknown';
        if (rental.tool.rented && 
            rental.tool.rentedTo && 
            rental.tool.rentedTo.user && 
            rental.tool.rentedTo.user.toString() === user._id.toString()) {
          toolStatus = 'rented';
        } else {
          toolStatus = 'not_rented';
        }

        return {
          _id: rental._id,
          tool: rental.tool,
          rentedAt: rental.rentedAt,
          rentedUntil: rental.rentedUntil,
          returnedAt: rental.returnedAt || null,
          status: status,
          toolStatus: toolStatus
        };
      });

    // Log some debug information
    const activeRentals = rentals.filter(r => r.status === 'active').length;
    const returnedRentals = rentals.filter(r => r.status === 'returned').length;
    console.log(`Found ${rentals.length} valid rentals for user: ${user.email}`);
    console.log(`Active: ${activeRentals}, Returned: ${returnedRentals}`);
    
    // Show a warning if there are any active rentals where the tool is not actually rented to this user
    const inconsistentRentals = rentals.filter(r => r.status === 'active' && r.toolStatus !== 'rented');
    if (inconsistentRentals.length > 0) {
      console.log(`WARNING: Found ${inconsistentRentals.length} active rentals where the tool is not actually rented to this user`);
      
      // Fix inconsistent rentals - mark them as returned
      for (const rental of inconsistentRentals) {
        console.log(`Fixing inconsistent rental for tool: ${rental.tool._id}`);
        const rentalIndex = user.toolsRented.findIndex(
          r => r.tool && r.tool._id && r.tool._id.toString() === rental.tool._id.toString()
        );
        
        if (rentalIndex !== -1 && !user.toolsRented[rentalIndex].returnedAt) {
          user.toolsRented[rentalIndex].returnedAt = new Date();
          rental.returnedAt = new Date();
          rental.status = 'returned';
          console.log(`Marked inconsistent rental as returned`);
          await user.save();
        }
      }
    }
    
    res.status(200).json({
      success: true,
      rentals: rentals
    });
  } catch (error) {
    console.error("Error fetching user rentals:", error);
    res.status(500).json({
      success: false,
      msg: "Error fetching user rentals"
    });
  }
});

// Add an endpoint to fix inconsistent rental states
router.post("/fix_rentals", authentication, async (req, res) => {
  try {
    console.log(`Fixing inconsistent rental states for user: ${req.email}`);
    
    // Find the user with their rentals
    const user = await User.findOne({ email: req.email })
      .populate({
        path: 'toolsRented.tool',
        select: 'name description price image owner rented rentedTo'
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found"
      });
    }

    if (!user.toolsRented || !Array.isArray(user.toolsRented)) {
      return res.status(200).json({
        success: true,
        msg: "No rentals to fix",
        fixedCount: 0
      });
    }

    let fixedCount = 0;
    const fixedRentals = [];

    // Process each rental record
    for (const rental of user.toolsRented) {
      // Skip if tool is null or no tool exists
      if (!rental.tool || !rental.tool._id) continue;

      // Case 1: The rental is marked active (no returnedAt) but the tool is not marked as rented
      if (!rental.returnedAt && (!rental.tool.rented || !rental.tool.rentedTo)) {
        console.log(`Found inconsistent rental: tool ${rental.tool._id} is not marked as rented but user has active rental`);
        
        // Fix: Mark the rental as returned
        rental.returnedAt = new Date();
        fixedCount++;
        fixedRentals.push({
          toolId: rental.tool._id,
          toolName: rental.tool.name,
          fixType: "marked_returned"
        });
      }
      
      // Case 2: The rental is marked as returned but the tool is still marked as rented to this user
      else if (rental.returnedAt && rental.tool.rented && rental.tool.rentedTo && 
               rental.tool.rentedTo.user && rental.tool.rentedTo.user.toString() === user._id.toString()) {
        console.log(`Found inconsistent rental: tool ${rental.tool._id} is still marked as rented to user but rental is returned`);
        
        // Fix: Mark the tool as not rented
        await Tool.findByIdAndUpdate(rental.tool._id, {
          $set: {
            rented: false,
            rentedTo: null
          }
        });
        
        fixedCount++;
        fixedRentals.push({
          toolId: rental.tool._id,
          toolName: rental.tool.name,
          fixType: "marked_not_rented"
        });
      }
    }

    // Save the user's changes
    if (fixedCount > 0) {
      await user.save();
      console.log(`Fixed ${fixedCount} inconsistent rentals`);
    } else {
      console.log('No inconsistent rentals found');
    }

    res.status(200).json({
      success: true,
      msg: fixedCount > 0 ? `Fixed ${fixedCount} inconsistent rentals` : "No inconsistent rentals found",
      fixedCount,
      fixedRentals
    });
  } catch (error) {
    console.error("Error fixing rentals:", error);
    res.status(500).json({
      success: false,
      msg: "Error fixing rental inconsistencies",
      error: error.message
    });
  }
});

module.exports = router;

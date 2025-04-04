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
        // Find the user and populate their uploaded tools
        const user = await User.findOne({ email: req.email });
        if (!user) {
            return res.status(404).json({ success: false, msg: "User not found!" });
        }

        // Find all users who have requested the user's tools
        const requesters = await User.find({
            'toolsRequested.tool': { $in: user.toolsUploaded }
        }).populate({
            path: 'toolsRequested.tool',
            match: { owner: user._id }, // Only include tools owned by the current user
            select: 'name description price image'
        });

        // Format the requests
        const requests = [];
        requesters.forEach(requester => {
            requester.toolsRequested.forEach(request => {
                if (request.tool) { // Only include if tool exists and matches (tool will be null if not owned by current user)
                    requests.push({
                        _id: request._id,
                        tool: request.tool,
                        status: request.status,
                        requester: {
                            _id: requester._id,
                            firstName: requester.firstName,
                            lastName: requester.lastName,
                            email: requester.email,
                            phoneNumber: requester.phoneNumber
                        }
                    });
                }
            });
        });

        res.json({ success: true, requests });
    } catch (error) {
        console.error("Error fetching tool requests:", error);
        res.status(500).json({ success: false, msg: "Error fetching tool requests", error });
    }
});

router.post("/updateRequestStatus", authentication, async (req, res) => {
    try {
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

        // Find the requester and update their request status
        const requester = await User.findById(requesterId);
        if (!requester) {
            return res.status(404).json({ success: false, msg: "Requester not found" });
        }

        const requestIndex = requester.toolsRequested.findIndex(
            request => request.tool.toString() === toolId
        );

        if (requestIndex === -1) {
            return res.status(404).json({ 
                success: false, 
                msg: "Request not found" 
            });
        }

        // Update the request status
        requester.toolsRequested[requestIndex].status = status;
        await requester.save();

        // If accepted, update tool status
        if (status === 'accepted') {
            tool.rented = true;
            await tool.save();
        }

        res.json({ 
            success: true, 
            msg: `Request ${status} successfully` 
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

module.exports = router;

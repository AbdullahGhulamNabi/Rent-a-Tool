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
            .populate('toolsRequested.tool', 'name description price image');
        
        if (!user) {
            return res.status(404).json({ msg: "User not found!" });
        }

        // Transform the requests to include tool details
        const requests = user.toolsRequested.map(request => ({
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

module.exports = router;

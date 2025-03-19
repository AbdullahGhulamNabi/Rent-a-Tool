const { Router } = require("express");
const mongoose = require("mongoose");
const router = Router();
const { User } = require("../DB/db_models");
const authentication = require("../Middlewares/Authentication");

router.get("/request", authentication, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.email });
        if (!user) {
            return res.status(404).json({ msg: "User not found!" });
        }

        // Ensure `toolsRequested` exists in the schema
        if (!user.toolsRequested) {
            return res.status(404).json({ msg: "No tools requested found!" });
        }

        res.json({ success: true, requestedTool: user.toolsRequested });
    } catch (error) {
        console.error("Error fetching tools request:", error); // Logging the error for debugging
        res.status(500).json({ msg: "Internal server error" });
    }
});



router.get("/offering", authentication, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.email });
        
        if (!user) {
            return res.status(404).json({ msg: "User not found!" });
        }

        res.json({ success: true, toolsListed: user.toolsUploaded });
    } catch (error) {
        console.error("Error fetching listed tools:", error);
        res.status(500).json({ msg: "Internal server error" });
    }
});

module.exports = router;

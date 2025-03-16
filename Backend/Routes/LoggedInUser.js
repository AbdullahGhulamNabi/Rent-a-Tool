const { Router } = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
// const User = require("../models/User");

const router = Router();
const { User , Tool, FeedBack } = require("../DB/db_models");
const authentication = require("../Middlewares/Authentication");
const formParser = require("../Middlewares/FormDataParser");
const multer = require("multer");
const path = require("path");
const { types } = require("util");
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, path.join(__dirname, "../public/Images"))
    },
    filename : function(req,file,cb){
        const uniqueSuffix = Date.now()
        cb(null , uniqueSuffix + file.originalname)
    }
})
const upload = multer({ storage })

router.post("/uploadProfilePhoto", authentication, upload.single("image"), async (req, res) => {
  const email = req.email;
  const imageName = req.file.filename;
  try{
    await User.updateOne({
        email: email,
    },{
        profilePhoto: imageName,
    })
    res.json({
        status : "ok"
    })
  }catch(error){
    res.json({
        status : error
    })
  }
});

router.get("/getProfilePhoto", authentication, async (req, res) => {
    try {
      const user = await User.findOne({ email: req.email });
        
      if (!user) {
        return res.status(404).json({ msg: "User not found!" });
      }
  
      res.json({
        success: true,
        profilePhoto: user.profilePhoto,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Error fetching profile photo", error });
    }
  })



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

  router.patch("/savePersonalInfo", authentication, formParser,async (req, res) => {
    try {
      const user  = await User.findOne({ email: req.email });
      const { firstName, lastName, userPhone, userPostalCode } = req.body;
      
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (userPhone) user.phoneNumber = userPhone;
      if (userPostalCode && !isNaN(userPostalCode)) {
          user.postalCode = parseInt(userPostalCode, 10);  // Convert to integer
      }


      await user.save();

      res.status(200).json({ msg: "Account settings updated successfully!", user });
      

    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  });


  router.patch("/updatePassword", authentication, formParser,async (req, res) => {
    try {
      const { currentPassword, newPassword, confirmedNewPassword } = req.body;

      const user = await User.findOne({ email: req.email });
      if (!user) return res.status(404).json({ error: "User not found" });

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(400).json({ error: "Incorrect old password" });
      if (newPassword != confirmedNewPassword) return res.status(404).json({error:"New password and confirmed password do not match"})
      
      user.password = newPassword;
      await user.save(); //automatically hashes the incoming password using middleware pre-save  
      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

module.exports = router;

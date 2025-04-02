const { Router } = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const router = Router();
const { User , Tool, FeedBack } = require("../DB/db_models");
const authentication = require("../Middlewares/Authentication");
const formParser = require("../Middlewares/FormDataParser");


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

// Save notification preferences
router.post("/saveNotificationPreferences", authentication, async (req, res) => {
    try {
        const { emailNotifications } = req.body;
        const user = await User.findOne({ email: req.email });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Add emailNotifications field if it doesn't exist
        user.emailNotifications = emailNotifications;
        await user.save();

        res.status(200).json({ message: "Notification preferences updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

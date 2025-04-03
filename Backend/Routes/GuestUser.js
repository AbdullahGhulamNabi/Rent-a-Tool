const { Router } = require("express");
const { User , Tool, FeedBack } = require("../DB/db_models");
const { jwt_secret } = require("../config");
const jwt = require("jsonwebtoken");
const router = Router();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { sendVerificationEmail } = require("../config/emailConfig");

// Signup post request
router.post("/signUp", async (req, res) => {
  try {
    const signUPDetails = req.body;
    console.log("Signup attempt with details:", {
      email: signUPDetails.email,
      firstName: signUPDetails.firstName,
      lastName: signUPDetails.lastName
    });

    const userExists = await User.findOne({ email: signUPDetails.email });
    console.log("User exists check:", userExists ? "Yes" : "No");

    if (!userExists) {
      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationTokenExpires = new Date();
      verificationTokenExpires.setHours(verificationTokenExpires.getHours() + 24);

      console.log("Creating new user...");
      const newUser = await User.create({
        firstName: signUPDetails.firstName,
        lastName: signUPDetails.lastName,
        email: signUPDetails.email,
        password: signUPDetails.password,
        phoneNumber: signUPDetails.phoneNumber,
        address: signUPDetails.address,
        postalCode: signUPDetails.postalCode,
        emailVerificationToken: verificationToken,
        emailVerificationTokenExpires: verificationTokenExpires
      });
      console.log("User created successfully");

      try {
        console.log("Sending verification email...");
        await sendVerificationEmail(signUPDetails.email, verificationToken);
        console.log("Verification email sent successfully");
      } catch (emailError) {
        console.error("Error sending verification email:", emailError);
        // Don't fail the signup if email sending fails
      }

      res.json({
        msg: "User created successfully. Please check your email to verify your account.",
      });
    } else {
      console.log("User already exists");
      res.status(400).json({
        msg: "User already exists",
      });
    }
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      msg: "Signup failed. Please try again.",
      error: error.message
    });
  }
});

// Verify email route
router.get("/verify-email/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationTokenExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({
        msg: "Invalid or expired verification token"
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationTokenExpires = null;
    await user.save();

    res.json({
      msg: "Email verified successfully"
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error verifying email"
    });
  }
});

// Login post request
router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(400).json({
      message: "User does not exist",
    });
    return;
  }

  if (!user.isEmailVerified) {
    res.status(400).json({
      message: "Please verify your email before logging in",
    });
    return;
  }

  const match_password = await bcrypt.compare(password, user.password);
  if (!match_password) {
    res.status(400).json({
      message: "Invalid credentials",
    });
    return;
  }

  const token = jwt.sign({ email }, jwt_secret);

  // Send user data along with token
  res.json({
    token: `Bearer ${token}`,
    message: "Login Successful",
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address,
      postalCode: user.postalCode,
      profilePhoto: user.profilePhoto
    }
  });
});

router.get("/products", async (req, res) => {
  const tools = await Tool.find()

  const formattedTools = await Promise.all(
    tools.map(async (tool) => {
      const owner = await User.findOne({ toolsUploaded: tool._id })
      const feedback = await FeedBack.find({ toolId: tool._id })
     

      return {
        imageName: tool.image.data.toString("base64"),
        toolName: tool.name,
        location: owner.address,
        personName: owner.firstName,
        rating: feedback.rating, 
        price: `$${tool.price}`,
      };
    })
  );
});

module.exports = router;

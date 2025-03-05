const { Router } = require("express");
const { User } = require("../DB/db_models");
const { jwt_secret } = require("../config")
const jwt = require("jsonwebtoken")
const router = Router();
const bcrypt = require("bcrypt");

// Signup post request
router.post("/signUp", async (req, res) => {
  const signUPDetails = req.body;
  const userExists = await User.findOne({ email: signUPDetails.email });

  if (!userExists) {
    const newUser = await User.create({
      firstName: signUPDetails.firstName,
      lastName: signUPDetails.lastName,
      email: signUPDetails.email,
      password: signUPDetails.password,
      phoneNumber: signUPDetails.phoneNumber,
      address: signUPDetails.address,
      postalCode: signUPDetails.postalCode,
    });
    res.json({
      msg: "User created successfully",
    });
  } else {
    res.json({
      msg: "User already exists",
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
      msg: "User does not exist",
    });
    return;
  }

  const match_password = await bcrypt.compare(password, user.password);
  if (!match_password) {
    res.status(400).json({
      msg: "Invalid credentials",
    });
    return;
  }

  const token = jwt.sign({email},jwt_secret)

  res.json({
    token,
  });


});



module.exports = router;

const mongoose = require("mongoose");
const fs = require("fs");
const bcrypt = require("bcrypt");
const path = require("path");

mongoose.connect(
  "mongodb+srv://admin:4jnNaYlQQSXi7hLT@cluster0.8rwzo.mongodb.net/Rent-a-Tool"
);


const users = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  phoneNumber: String,
  address: String,
  postalCode: Number,
  emailNotifications: {
    type: Boolean,
    default: false
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    default: null
  },
  emailVerificationTokenExpires: {
    type: Date,
    default: null
  },
  profilePhoto: {
    type : String,
    default: 'Default_ProfilePic.png'
  },
  toolsUploaded: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tools",
    },
  ],
  toolsRented: [
    {
      tool: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tools'
      },
      rentedAt: {
        type: Date
      },
      rentedUntil: {
        type: Date
      }
    }
  ],
  toolsRequested: [
    {
      tool: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tools",
      },
      status: {
        type: String,
        enum: ["pending", "accepted", "rejected", "completed"],
        default: "pending", 
      }
    }
  ]
});

users.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const tools = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
  price: {
    type: Number,
    default: 0,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  rented: {
    type: Boolean,
    default: false,
  },
  rentedTo: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users'
    },
    rentedAt: {
      type: Date
    },
    rentedUntil: {
      type: Date
    }
  }
});

const feedback = new mongoose.Schema({
  userId: {
    // for user that is giving the review of tool
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  toolId: {
    // for the tool that is being reviewed
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tools",
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  desc: {
    type: String,
    maxlength: 1000,
  },
});

const chat = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
  messages: [
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
      text: String,
      time: {
        type: Date,
        default: Date.now,
      },
      read: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

const payment = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  tool: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tools",
  },
  amount: Number,
  paymentId: {
    type: String,
    required: true,
    unique: true,
  },
  paymentMethod: {
    type: String,
    enum: ["Credit Card", "Debit Card", "EasyPaisa"],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("Users", users, "Users");
const Tool = mongoose.model("Tools", tools, "Tools");
const FeedBack = mongoose.model("FeedBack", feedback, "FeedBack");
const Chat = mongoose.model("Chat", chat, "Chat");
const Payment = mongoose.model("Payment", payment, "Payment");

module.exports = {
  User,
  Tool,
  FeedBack,
  Chat,
  Payment,
};

const mongoose = require("mongoose");
const multer = require("multer");
const { boolean } = require("zod");

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
  toolsUploaded: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tools",
    },
  ],
  toolsRented: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tools",
    },
  ],
});

const tools = new mongoose.Schema({
  name: String,
  description: String,
  image: {
    data: Buffer,
    contentType: String,
  },
  price: {
    type: Number,
    default: 0,
  },
  rented: {
    type: Boolean,
    default: false,
  },
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

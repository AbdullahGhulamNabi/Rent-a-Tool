require("dotenv").config();
// const crypto = require('crypto')
// const jwt_secret = crypto.randomBytes(64).toString('hex')

const jwt_secret = process.env.JWT_SECRET;

if (!jwt_secret) {
    throw new Error("JWT_SECRET is missing in .env file");
  }

module.exports = {
    jwt_secret,
}

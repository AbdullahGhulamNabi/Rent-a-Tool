const crypto = require('crypto')
const jwt_secret = crypto.randomBytes(64).toString('hex')

module.exports = {
    jwt_secret,
}

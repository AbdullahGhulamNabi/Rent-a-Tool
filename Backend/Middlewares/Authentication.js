const jwt = require("jsonwebtoken")
const { jwt_secret } = require("../config")

function userMiddleware(req,res,next){
    const token = req.headers.authorization

    const word = token.split(" ")
    const jwtToken = word[1]
    const decodedValue = jwt.verify(jwtToken , jwt_secret)

    if(decodedValue.email){
        req.email = decodedValue.email 
        next()
    }
    else{
        res.status(403).json({
            msg : "You are not authenticated"
        })
    }
}

module.exports = userMiddleware
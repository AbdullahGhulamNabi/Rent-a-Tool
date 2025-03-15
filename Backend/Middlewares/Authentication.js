const jwt = require("jsonwebtoken")
const { jwt_secret } = require("../config")

function userMiddleware(req,res,next){
    const token = req.headers.authorization || "";
    if (!token.startsWith("Bearer ")) {
        return res.status(401).json({ msg: "Token is missing or invalid" });
    }

    const word = token.split(" ")
    const jwtToken = word[1]
    
    let decodedValue;
    try {
        decodedValue = jwt.verify(jwtToken, jwt_secret);
    } catch (err) {
        return res.status(403).json({ msg: "Invalid or expired token" });
    }
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
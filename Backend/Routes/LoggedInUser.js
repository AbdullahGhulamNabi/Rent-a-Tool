const express = require("express");
const router = express.Router();
const authentication = require('../Middlewares/Authentication')

router.get('/logout',authentication,(req,res)=>{
    
})

exports.router = router;

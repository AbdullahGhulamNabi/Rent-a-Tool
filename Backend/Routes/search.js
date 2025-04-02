const { Router } = require("express");
const mongoose = require("mongoose");
const router = Router();
const { User , Tool, FeedBack } = require("../DB/db_models");
const authentication = require("../Middlewares/Authentication");


router.get("/getSearchedTool", authentication, async (req, res) => {
    try {

        const search = req.body.search_query
        const search_query = search.trim();
        const user = await User.findOne({ email: req.email });

        const usersWithSamePostalCode = await User.find({postalCode: user.postalCode,_id: { $ne: user._id }}).select("_id")
        const userIds = usersWithSamePostalCode.map(user => user._id);
        console.log(userIds)

        console.log("search:",search_query)

        const matchedTools = await Tool.find({
            owner: { $in: userIds },
            name: { $regex: new RegExp(`^${search_query}`, "i") } 
        });
        
        
        console.log("matched Tools",matchedTools)
        
        res.status(200).json({matchedTools})

    } catch (error) {
        res.status(500).json({ msg: "Error fetching tool count" });
    }
});



module.exports = router;

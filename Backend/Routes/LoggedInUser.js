const { Router } = require("express");
const router = Router();
const { User , Tool, FeedBack } = require("../DB/db_models");
const authentication = require("../Middlewares/Authentication");
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, path.join(__dirname, "../public/Images"))
    },
    filename : function(req,file,cb){
        const uniqueSuffix = Date.now()
        cb(null , uniqueSuffix + file.originalname)
    }
})
const upload = multer({ storage })

router.post("/uploadProfilePhoto", authentication, upload.single("image"), async (req, res) => {
  const email = req.email;
  const imageName = req.file.filename;
  try{
    await User.updateOne({
        email: email,
    },{
        profilePhoto: imageName,
    })
    res.json({
        status : "ok"
    })
  }catch(error){
    res.json({
        status : error
    })
  }
});

router.get("/getProfilePhoto", authentication, async (req, res) => {
    try {
      const user = await User.findOne({ email: req.email });
        
      if (!user) {
        return res.status(404).json({ msg: "User not found!" });
      }
  
      res.json({
        success: true,
        profilePhoto: user.profilePhoto,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Error fetching profile photo", error });
    }
  })


module.exports = router;

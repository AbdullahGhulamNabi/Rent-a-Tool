const mongoose = require("mongoose")
const multer = require('multer')

mongoose.connect('mongodb+srv://admin:4jnNaYlQQSXi7hLT@cluster0.8rwzo.mongodb.net/Rent-a-Tool')

const users = new mongoose.Schema({
    firstName : String,
    lastName : String,
    email : String,
    password : String,
    phoneNumber : String,
    address : String,
    postalCode : Number,
    toolsUploaded : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Tools'
    },
    toolsRented : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Tools'
    }
})

const tools = new mongoose.Schema({
    name : String,
    description : String,
    image :{
        data : Buffer,
        contentType: String
    },
    price :{
        type : Number,
        default: 0
    },
    rented : {
        type : Boolean,
        default : false
    }

})

const feedback = new mongoose.Schema({
    userId : {      // for user that is giving the review of tool
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    ToolId : {      // for the tool that is being reviewed
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Tool'
    },
    rating : {
        type : Number,
        min : 1,
        max : 5
    },
    desc : {
        type : String,
        maxlength : 1000
    }
})

const User = mongoose.model('Users' , users , 'Users')
const Tool = mongoose.model('Tools' , tools , 'Tools')
const FeedBack = mongoose.model('FeedBack' , feedback , 'FeedBack')

module.exports = {
    User,
    Tool,
}
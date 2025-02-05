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
    }

})

const User = mongoose.model('Users' , users , 'Users')
const Tool = mongoose.model('Tools' , tools , 'Tools')

module.exports = {
    User,
    Tool
}
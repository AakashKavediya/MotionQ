const mongoose = require("mongoose")


const loginSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100,
        trim: true,
        lowercase: true,        
    },
    password: {
        type: String,
        required: true,
        minlength: 8, // 8+ is recommended for security
        maxlength: 1024
    },

})

module.exports = mongoose.model("login",loginSchema)
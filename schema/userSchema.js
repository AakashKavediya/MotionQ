// models/User.js
const mongoose = require("mongoose");

const SignUpSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 25,
    trim: true
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100,
    trim: true,
    lowercase: true,
    unique: true // ensure uniqueness at DB level
  },
  password: {
    type: String,
    required: true,
    minlength: 8, // 8+ is recommended for security
    maxlength: 1024
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("User", SignUpSchema);

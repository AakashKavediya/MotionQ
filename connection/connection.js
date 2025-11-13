// connection/connection.js
const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/MotionQ";

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return mongoose;
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log("MongoDB connected");
  return mongoose;
};

module.exports = connectDB;

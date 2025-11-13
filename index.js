const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const Connection = require("./connection/connection");
const User = require("./schema/userSchema");


const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));
Connection().catch((err) => console.error("DB connection error:", err));

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// SIGNUP ROUTE
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // 🔐 BCRYPT HASHING
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword, // store hashed password
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});



app.post(
  "/login",
  asyncHandler(async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Please provide email and password" });
      }

      const existingUser = await User.findOne({ email }).exec();

      if (!existingUser) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Compare submitted password with stored (hashed) password
      const isMatch = await bcrypt.compare(password, existingUser.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      return res.status(200).json({
        message: "Successfully logged in",
        userId: existingUser._id.toString(),
      });
    } catch (err) {
      console.error("Login Error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  })
);


const PORT = process.env.PORT || 8000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));

// Global error handler (catches unhandled errors)
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

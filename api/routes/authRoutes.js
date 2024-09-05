const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { default: mongoose } = require("mongoose");
const router = express.Router();

const jwtSecret = "fbvvvwevtntn";
const bcryptSalt = bcrypt.genSaltSync(10);

// Route: /register
router.post("/register", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { name, email, password } = req.body;
  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.json(userDoc);
  } catch (error) {
    console.error("Registration error:", error); // Log the error for internal debugging
    res
      .status(422)
      .json({ error: "Registration failed. Please try again later." });
  }
});

// Route: /login
router.post("/login", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign(
        { email: userDoc.email, id: userDoc._id },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json(userDoc);
        }
      );
    } else {
      res.status(422).json("pass not ok");
    }
  } else {
    res.json("not found");
  }
});

// Route: /logout
router.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

module.exports = router;

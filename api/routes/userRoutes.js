const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

const jwtSecret = "fbvvvwevtntn";

// Route: /profile
router.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, id } = await User.findById(userData.id);
      res.json({ name, email, id });
    });
  } else {
    res.json(null);
  }
});

module.exports = router;

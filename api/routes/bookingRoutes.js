const express = require('express');
const jwt = require('jsonwebtoken');
const Booking = require('../models/booking.js');
const router = express.Router();

const jwtSecret = "fbvvvwevtntn";

function getUserDataFromReq(req) {
    return new Promise((resolve, reject) => {
      jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        resolve(userData);
      });
    });
  }

// Route: /bookings (POST)
router.post("/bookings", async (req, res) => {
    const userData = await getUserDataFromReq(req);
    const { place, checkIn, checkOut, name, phone, price } = req.body;
    Booking.create({
      place,
      checkIn,
      checkOut,
      name,
      phone,
      price,
      user: userData.id,
    })
      .then((doc) => {
        res.json(doc);
      })
      .catch((err) => {
        throw err;
      });
  });

// Route: /bookings (GET)
router.get("/bookings", async (req, res) => {
    const userData = await getUserDataFromReq(req);
    res.json(await Booking.find({ user: userData.id }).populate("place"));
  });

module.exports = router;

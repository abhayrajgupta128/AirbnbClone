
const express = require("express");
const jwt = require("jsonwebtoken");
const Place = require("../models/Place");
const path = require("path");
const uploadsDir = path.join(process.cwd(), "uploads");
const imageDownloader = require("image-downloader");
const multer = require("multer");
const fs = require("fs");
const mongoose = require("mongoose");
const jwtSecret = "fbvvvwevtntn";
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const {storage} = require("../cloudConfig");
const photosMiddleware = multer({ storage });

// Route: /places (POST)
router.post("/places", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  const {
    title,
    address,
    addedPhotos,
    description,
    price,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.create({
      owner: userData.id,
      price,
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
    });
    res.json(placeDoc);
  });
});

// Route: /places (GET)
router.get("/places", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.json(await Place.find());
});

// Route: /user-places (GET)
router.get("/user-places", (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const { id } = userData;
    res.json(await Place.find({ owner: id }));
  });
});

// Route: /places/:id (GET)
router.get("/places/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;
  res.json(await Place.findById(id));
});

// Route: /places (PUT)
router.put("/places", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  const {
    id,
    title,
    address,
    addedPhotos,
    description,
    price,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        price,
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
      });
      await placeDoc.save();
      res.json("ok");
    }
  });
});

// // Route: /upload-by-link (POST)
router.post("/upload-by-link", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  const localPath = __dirname + "/../uploads/" + newName;
  try {
    await imageDownloader.image({
      url: link,
      dest: localPath,
    });

    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(localPath, {
      public_id: `airbnb/${newName}`,
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    });

    // Delete the local file after uploading
    fs.unlinkSync(localPath);
    res.status(201).json({ url: result.secure_url });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Image upload failed" });
  }
});

// // Route: /upload (POST)
router.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const uploadedFiles = req.files.map(file => file.path);
  res.json(uploadedFiles);
});



module.exports = router;

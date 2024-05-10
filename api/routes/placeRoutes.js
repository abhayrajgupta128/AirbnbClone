const express = require("express");
const jwt = require("jsonwebtoken");
const Place = require("../models/Place");
const path = require("path");
const uploadsDir = path.join(process.cwd(), "uploads");
const imageDownloader = require("image-downloader");
const multer = require("multer");
const fs = require("fs");

const jwtSecret = "fbvvvwevtntn";
const router = express.Router();

const photosMiddleware = multer({ dest: "uploads/" });

// Route: /places (POST)
router.post("/places", async (req, res) => {
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
  res.json(await Place.find());
});

// Route: /user-places (GET)
router.get("/user-places", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const { id } = userData;
    res.json(await Place.find({ owner: id }));
  });
});

// Route: /places/:id (GET)
router.get("/places/:id", async (req, res) => {
  const { id } = req.params;
  res.json(await Place.findById(id));
});

// Route: /places (PUT)
router.put("/places", async (req, res) => {
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
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  try {
    await imageDownloader.image({
      url: link,
      dest: path.join(uploadsDir, newName), // Use the uploads directory
    });
    res.json(newName);
  } catch (error) {
    console.error("Error downloading image:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// // Route: /upload (POST)
router.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    console.log(newPath);
    uploadedFiles.push(newPath.replace(/uploads[\\\/]/, ""));
  }
  res.json(uploadedFiles);
});



module.exports = router;

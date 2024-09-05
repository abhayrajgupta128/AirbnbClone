const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const placeRoutes = require("./routes/placeRoutes");
const bookingRoutes = require("./routes/bookingRoutes");


const app = express();

// // Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

// // Connect to MongoDB
const dbUrl = process.env.MONGO_URL;
mongoose
  .connect(dbUrl)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// // Route middleware
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/place", placeRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/uploads", express.static(__dirname + "/uploads"));

// for testing
app.get("/test", (req, res) => {
  res.json("test ok");
});

// // Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// YZCDiYMv8hTuERdd

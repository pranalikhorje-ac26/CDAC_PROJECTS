const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
  updateProfile
} = require("../controllers/authController");

const verifyToken = require("../middlewares/authMiddleware");

// Registration API
router.post("/register", registerUser);

// Login API
router.post("/login", loginUser);

// Update Profile API
router.put("/profile", verifyToken, updateProfile);

module.exports = router;

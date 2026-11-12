const express = require("express");
const router = express.Router();

const {
    sendMessage,
    getAllContactMessages,
    updateContactMessageStatus,
    deleteContactMessage
} = require("../controllers/contactController");

const verifyToken = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

// Submit contact message (PUBLIC)
router.post("/", sendMessage);

// Get all contact messages (ADMIN)
router.get("/", verifyToken, adminMiddleware, getAllContactMessages);

// Update message status (ADMIN)
router.patch("/:messageId/status", verifyToken, adminMiddleware, updateContactMessageStatus);

// Delete contact message (ADMIN)
router.delete("/:messageId", verifyToken, adminMiddleware, deleteContactMessage);

module.exports = router;
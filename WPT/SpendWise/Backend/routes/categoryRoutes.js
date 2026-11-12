const express = require("express");
const router = express.Router();

const {
    createCategory,
    getCategories,
    updateCategory,
    addAmountToCategory,
    deleteCategory
} = require("../controllers/categoryController");

const verifyToken = require("../middlewares/authMiddleware");

// Create category with initial amount
router.post("/", verifyToken, createCategory);

// Get all categories
router.get("/", verifyToken, getCategories);

// Update category
router.put("/:id", verifyToken, updateCategory);

// Add amount to existing category
router.post("/:id/add-amount", verifyToken, addAmountToCategory);

// Delete category
router.delete("/:id", verifyToken, deleteCategory);

module.exports = router;
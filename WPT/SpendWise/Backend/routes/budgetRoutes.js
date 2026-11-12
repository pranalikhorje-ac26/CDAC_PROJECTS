const express = require("express");
const router = express.Router();

// Import budget controller functions
const {
    createBudget,
    getBudgets,
    updateBudget,
    deleteBudget
} = require("../controllers/budgetController");

// Import JWT middleware
const verifyToken = require("../middlewares/authMiddleware");

// CREATE budget
// POST http://localhost:5000/api/budgets
router.post("/", verifyToken, createBudget);

// GET all budgets
// GET http://localhost:5000/api/budgets
router.get("/", verifyToken, getBudgets);

// UPDATE budget
// PUT http://localhost:5000/api/budgets/:id
router.put("/:id", verifyToken, updateBudget);

// DELETE budget
// DELETE http://localhost:5000/api/budgets/:id
router.delete("/:id", verifyToken, deleteBudget);

module.exports = router;
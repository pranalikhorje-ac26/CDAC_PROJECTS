const express = require("express");
const router = express.Router();

const {
    createSavingsGoal,
    getSavingsGoals,
    updateSavingsGoal,
    deleteSavingsGoal,
    addMoneyToSavingsGoal
} = require("../controllers/savingsGoalController");

const verifyToken = require("../middlewares/authMiddleware");

// Create savings goal
//http://localhost:5000/api/savings-goals
router.post("/", verifyToken, createSavingsGoal);

// Get all savings goals
//http://localhost:5000/api/savings-goals/GOAL_ID/add-money
router.get("/", verifyToken, getSavingsGoals);

// Update savings goal
//http://localhost:5000/api/savings-goals/GOAL_ID
router.put("/:id", verifyToken, updateSavingsGoal);

// Delete savings goal
//http://localhost:5000/api/savings-goals/GOAL_ID
router.delete("/:id", verifyToken, deleteSavingsGoal);

// Add money to savings goal
router.patch("/:id/add-money", verifyToken, addMoneyToSavingsGoal);

module.exports = router;
const express = require("express");
const router = express.Router();

const {
    getDashboardSummary,
    getRecentTransactions,
    getExpenseByCategory,
    getMonthlyFinancialSummary,
    getSavingsOverview
} = require("../controllers/dashboardController");

const verifyToken = require("../middlewares/authMiddleware");

// Dashboard Summary
router.get("/summary", verifyToken, getDashboardSummary);

// Recent Transactions
router.get("/recent-transactions", verifyToken, getRecentTransactions);

// Expense By Category
router.get("/expense-by-category", verifyToken, getExpenseByCategory);


// Monthly Financial Summary
router.get("/monthly-summary", verifyToken, getMonthlyFinancialSummary);

// Savings Overview
router.get("/savings-overview", verifyToken, getSavingsOverview);

module.exports = router;
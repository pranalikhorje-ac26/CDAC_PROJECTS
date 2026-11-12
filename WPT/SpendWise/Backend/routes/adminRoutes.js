const express = require("express");
const router = express.Router();

const {
    getAdminDashboardSummary,
    getAllUsers,
    getAllTransactions,
    getAdminMonthlySummary,
    getAdminExpenseByCategory,
    updateUserStatus
} = require("../controllers/adminController");

const verifyToken = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

// ADMIN DASHBOARD SUMMARY
router.get( "/dashboard-summary", verifyToken,adminMiddleware,getAdminDashboardSummary);

// GET ALL USERS
router.get("/users",verifyToken,adminMiddleware, getAllUsers);

// GET ALL TRANSACTIONS
router.get("/transactions",verifyToken,adminMiddleware,getAllTransactions);

// ADMIN MONTHLY FINANCIAL SUMMARY
router.get("/monthly-summary",verifyToken,adminMiddleware,getAdminMonthlySummary);

// ADMIN EXPENSE BY CATEGORY
router.get("/expense-by-category",verifyToken,adminMiddleware,getAdminExpenseByCategory);
// BLOCK / UNBLOCK USER
router.patch("/users/:userId/status",verifyToken,adminMiddleware,updateUserStatus);

module.exports = router;
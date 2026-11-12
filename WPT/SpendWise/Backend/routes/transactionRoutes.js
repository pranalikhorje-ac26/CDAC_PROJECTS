const express = require("express");
const router = express.Router();

// Import controller functions
const {
    createTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction
} = require("../controllers/transactionController");

// Import JWT middleware
const verifyToken = require("../middlewares/authMiddleware");

// CREATE transaction
//http://localhost:5000/api/transactions
router.post("/", verifyToken, createTransaction);

// GET all transactions
//http://localhost:5000/api/transactions
router.get("/", verifyToken, getTransactions);

// UPDATE transaction
//http://localhost:5000/api/transactions/:id
router.put("/:id", verifyToken, updateTransaction);

// DELETE transaction
//http://localhost:5000/api/transactions/:id
router.delete("/:id", verifyToken, deleteTransaction);

module.exports = router;
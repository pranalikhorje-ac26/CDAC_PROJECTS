const Transaction = require("../models/Transactions");
const Category = require("../models/Categories");

// 1. CREATE TRANSACTION
const createTransaction = async (req, res) => {
  try {
    const {
      type,
      categoryId,
      amount,
      description,
    } = req.body;

    // Validate required fields
    if (!type || !categoryId || amount === undefined) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    // Validate transaction type
    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({
        message: "Type must be income or expense",
      });
    }

    // Validate amount
    if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than zero",
      });
    }

    // Check category
    const category = await Category.findOne({
      _id: categoryId,
      userId: req.user._id,
      type,
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found or category type does not match",
      });
    }

    // Create transaction with automatic date and time
    const transaction = await Transaction.create({
      type,
      categoryId,
      amount: Number(amount),
      description,
      userId: req.user._id,
    });

    res.status(201).json({
      message: "Transaction created successfully",
      transaction,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// 2. GET ALL TRANSACTIONS
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      userId: req.user._id,
    })
      .populate("categoryId", "name type")
      .sort({ date: -1 });

    res.status(200).json({
      message: "Transactions fetched successfully",
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// 3. UPDATE TRANSACTION
const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      type,
      categoryId,
      amount,
      description,
    } = req.body;

    const transaction = await Transaction.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    const newType = type ?? transaction.type;
    const newCategoryId = categoryId ?? transaction.categoryId;

    if (!["income", "expense"].includes(newType)) {
      return res.status(400).json({
        message: "Type must be income or expense",
      });
    }

    const category = await Category.findOne({
      _id: newCategoryId,
      userId: req.user._id,
      type: newType,
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found or category type does not match",
      });
    }

    if (
      amount !== undefined &&
      (!Number.isFinite(Number(amount)) || Number(amount) <= 0)
    ) {
      return res.status(400).json({
        message: "Amount must be greater than zero",
      });
    }

    transaction.type = newType;
    transaction.categoryId = newCategoryId;

    if (amount !== undefined) {
      transaction.amount = Number(amount);
    }

    if (description !== undefined) {
      transaction.description = description;
    }

    // Original transaction date and time remain unchanged
    await transaction.save();

    res.status(200).json({
      message: "Transaction updated successfully",
      transaction,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// 4. DELETE TRANSACTION
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
};
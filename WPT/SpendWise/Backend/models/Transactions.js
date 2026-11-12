const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, "Transaction type is required"],
      enum: ["income", "expense"],
      lowercase: true,
      trim: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categories",
      required: [true, "Category is required"],
    },

    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than zero"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [250, "Description cannot exceed 250 characters"],
    },

    date: {
      type: Date,
      default: Date.now,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Transaction must belong to a user"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);
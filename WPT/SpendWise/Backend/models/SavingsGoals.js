const mongoose = require("mongoose");

// Schema for individual savings contributions
const contributionSchema = new mongoose.Schema(
    {
        amount: {
            type: Number,
            required: true,
            min: [0.01, "Contribution must be greater than zero"]
        },

        date: {
            type: Date,
            default: Date.now
        }
    }
);

const savingsGoalSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: [true, "Savings goal must belong to a user"]
        },

        goalName: {
            type: String,
            required: [true, "Goal name is required"],
            trim: true,
            maxlength: [100, "Goal name cannot exceed 100 characters"],
            match: [/^[A-Za-z ]+$/, "Goal name should contain only letters"]
        },

        targetAmount: {
            type: Number,
            required: [true, "Target amount is required"],
            min: [0, "Target amount must be greater than zero"]
        },

        savedAmount: {
            type: Number,
            default: 0,
            min: [0, "Saved amount cannot be negative"]
        },

        // Stores individual savings contributions
        contributions: {
            type: [contributionSchema],
            default: []
        },

        targetDate: {
            type: Date,
            required: [true, "Target date is required"]
        },

        description: {
            type: String,
            trim: true,
            maxlength: [250, "Description cannot exceed 250 characters"]
        },

        status: {
            type: String,
            enum: ["active", "completed"],
            default: "active"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "SavingsGoals",
    savingsGoalSchema
);
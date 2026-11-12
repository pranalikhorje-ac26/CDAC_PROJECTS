const Transaction = require("../models/Transactions");

// GET DASHBOARD SUMMARY
const getDashboardSummary = async (req, res) => {
    try {

        const userId = req.user._id;

        // Calculate total income and expenses
        const summary = await Transaction.aggregate([
            {
                $match: {
                    userId: userId
                }
            },
            {
                $group: {
                    _id: "$type",
                    totalAmount: {
                        $sum: "$amount"
                    }
                }
            }
        ]);

        let totalIncome = 0;
        let totalExpense = 0;

        summary.forEach((item) => {

            if (item._id === "income") {
                totalIncome = item.totalAmount;
            }

            if (item._id === "expense") {
                totalExpense = item.totalAmount;
            }

        });

        // Calculate available balance
        const balance = totalIncome - totalExpense;

        res.status(200).json({
            success: true,
            message: "Dashboard summary fetched successfully",

            data: {
                totalIncome,
                totalExpense,
                balance
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
// GET RECENT TRANSACTIONS
const getRecentTransactions = async (req, res) => {
    try {

        const transactions = await Transaction.find({
            userId: req.user._id
        })
        .populate("categoryId", "name type")
        .sort({ date: -1 })
        .limit(5);

        res.status(200).json({
            success: true,
            message: "Recent transactions fetched successfully",
            count: transactions.length,
            transactions
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// GET EXPENSE BY CATEGORY
const getExpenseByCategory = async (req, res) => {
    try {

        const userId = req.user._id;

        const expenses = await Transaction.aggregate([
            {
                $match: {
                    userId: userId,
                    type: "expense"
                }
            },
            {
                $group: {
                    _id: "$categoryId",
                    totalExpense: {
                        $sum: "$amount"
                    }
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "_id",
                    foreignField: "_id",
                    as: "category"
                }
            },
            {
                $unwind: "$category"
            },
            {
                $project: {
                    _id: 0,
                    categoryId: "$_id",
                    categoryName: "$category.name",
                    totalExpense: 1
                }
            },
            {
                $sort: {
                    totalExpense: -1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            message: "Expense by category fetched successfully",
            expenses
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// GET MONTHLY FINANCIAL SUMMARY
const getMonthlyFinancialSummary = async (req, res) => {
    try {

        const userId = req.user._id;

        const summary = await Transaction.aggregate([
            {
                $match: {
                    userId: userId
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" },
                        type: "$type"
                    },
                    totalAmount: {
                        $sum: "$amount"
                    }
                }
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1
                }
            }
        ]);

        const monthlyData = {};

        summary.forEach((item) => {

            const key = `${item._id.year}-${String(item._id.month).padStart(2, "0")}`;

            if (!monthlyData[key]) {
                monthlyData[key] = {
                    year: item._id.year,
                    month: item._id.month,
                    totalIncome: 0,
                    totalExpense: 0
                };
            }

            if (item._id.type === "income") {
                monthlyData[key].totalIncome = item.totalAmount;
            }

            if (item._id.type === "expense") {
                monthlyData[key].totalExpense = item.totalAmount;
            }

        });

        const result = Object.values(monthlyData).map((item) => ({
            ...item,
            savings: item.totalIncome - item.totalExpense
        }));

        res.status(200).json({
            success: true,
            message: "Monthly financial summary fetched successfully",
            monthlySummary: result
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const SavingsGoal = require("../models/SavingsGoals");

// GET SAVINGS OVERVIEW
const getSavingsOverview = async (req, res) => {
    try {

        const goals = await SavingsGoal.find({
            userId: req.user._id
        }).sort({ createdAt: -1 });

        const savingsOverview = goals.map((goal) => {

            const remainingAmount = Math.max(
                goal.targetAmount - goal.savedAmount,
                0
            );

            const progressPercentage = Math.min(
                (goal.savedAmount / goal.targetAmount) * 100,
                100
            );

            return {
                _id: goal._id,
                goalName: goal.goalName,
                targetAmount: goal.targetAmount,
                savedAmount: goal.savedAmount,
                remainingAmount,
                progressPercentage: Number(
                    progressPercentage.toFixed(2)
                ),
                targetDate: goal.targetDate,
                status: goal.status
            };

        });

        const totalTargetAmount = goals.reduce(
            (total, goal) => total + goal.targetAmount,
            0
        );

        const totalSavedAmount = goals.reduce(
            (total, goal) => total + goal.savedAmount,
            0
        );

        res.status(200).json({
            success: true,
            message: "Savings overview fetched successfully",

            summary: {
                totalGoals: goals.length,
                totalTargetAmount,
                totalSavedAmount,
                totalRemainingAmount: Math.max(
                    totalTargetAmount - totalSavedAmount,
                    0
                )
            },

            savingsOverview

        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    getDashboardSummary,getRecentTransactions, getExpenseByCategory,
     getMonthlyFinancialSummary, getSavingsOverview
};
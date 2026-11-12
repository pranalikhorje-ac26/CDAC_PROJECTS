const User = require("../models/Users");
const Transaction = require("../models/Transactions");

// CREATE DATE FILTER
const getDateFilter = (startDate, endDate) => {
    const filter = {};

    if (startDate || endDate) {
        filter.date = {};

        if (startDate) {
            const start = new Date(startDate);

            if (Number.isNaN(start.getTime())) {
                throw new Error("Invalid start date");
            }

            filter.date.$gte = start;
        }

        if (endDate) {
            const end = new Date(endDate);

            if (Number.isNaN(end.getTime())) {
                throw new Error("Invalid end date");
            }

            end.setUTCHours(23, 59, 59, 999);
            filter.date.$lte = end;
        }

        if (
            filter.date.$gte &&
            filter.date.$lte &&
            filter.date.$gte > filter.date.$lte
        ) {
            throw new Error("Start date cannot be after end date");
        }
    }

    return filter;
};


// GET ADMIN DASHBOARD SUMMARY
const getAdminDashboardSummary = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const dateFilter = getDateFilter(startDate, endDate);

        const totalUsers = await User.countDocuments();

        const totalTransactions = await Transaction.countDocuments(dateFilter);

        const financialSummary = await Transaction.aggregate([
            {
                $match: dateFilter
            },
            {
                $group: {
                    _id: "$type",
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        let totalIncome = 0;
        let totalExpense = 0;

        financialSummary.forEach((item) => {
            if (item._id === "income") {
                totalIncome = item.totalAmount;
            }

            if (item._id === "expense") {
                totalExpense = item.totalAmount;
            }
        });

        const totalBalance = totalIncome - totalExpense;

        res.status(200).json({
            success: true,
            message: "Admin dashboard summary fetched successfully",
            data: {
                totalUsers,
                totalTransactions,
                totalIncome,
                totalExpense,
                totalBalance
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET ALL REGISTERED USERS
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("username email phone_no role isBlocked");

        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            totalUsers: users.length,
            users
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET ALL USERS' TRANSACTIONS
const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find()
            .populate("userId", "username email")
            .populate("categoryId", "name type")
            .sort({ date: -1 });

        res.status(200).json({
            success: true,
            message: "All transactions fetched successfully",
            totalTransactions: transactions.length,
            transactions
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// BLOCK / UNBLOCK USER
const updateUserStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const { isBlocked } = req.body;

        if (typeof isBlocked !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "isBlocked must be true or false"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Prevent admin from blocking themselves
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot block your own account"
            });
        }

        // Prevent blocking another admin
        if (user.role === "admin") {
            return res.status(403).json({
                success: false,
                message: "You cannot block another admin"
            });
        }

        user.isBlocked = isBlocked;

        await user.save();

        res.status(200).json({
            success: true,
            message: isBlocked
                ? "User blocked successfully"
                : "User unblocked successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                isBlocked: user.isBlocked
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET MONTHLY FINANCIAL SUMMARY
const getAdminMonthlySummary = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const dateFilter = getDateFilter(startDate, endDate);

        const summary = await Transaction.aggregate([
            {
                $match: dateFilter
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" },
                        type: "$type"
                    },
                    totalAmount: { $sum: "$amount" }
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
            const year = item._id.year;
            const month = item._id.month;

            const key = `${year}-${String(month).padStart(2, "0")}`;

            if (!monthlyData[key]) {
                monthlyData[key] = {
                    year,
                    month,
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

        const monthlySummary = Object.values(monthlyData).map((item) => ({
            ...item,
            savings: item.totalIncome - item.totalExpense
        }));

        res.status(200).json({
            success: true,
            message: "Admin monthly summary fetched successfully",
            monthlySummary
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET EXPENSE BY CATEGORY
const getAdminExpenseByCategory = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const dateFilter = getDateFilter(startDate, endDate);

        const expenses = await Transaction.aggregate([
            {
                $match: {
                    ...dateFilter,
                    type: "expense"
                }
            },
            {
                $group: {
                    _id: "$categoryId",
                    totalExpense: { $sum: "$amount" }
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
            message: "Admin expense by category fetched successfully",
            expenses
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// EXPORT CONTROLLERS
module.exports = {
    getAdminDashboardSummary,
    getAllUsers,
    getAllTransactions,
    getAdminMonthlySummary,
    getAdminExpenseByCategory,
    updateUserStatus
};
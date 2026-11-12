const Budget = require("../models/Budget_collections");
const Category = require("../models/Categories");
const Transaction = require("../models/Transactions");

// 1. CREATE BUDGET
const createBudget = async (req, res) => {
    try {
        const { categoryId, monthlyLimit, month, year } = req.body;

        if (!categoryId || monthlyLimit === undefined || !month || !year) {
            return res.status(400).json({
                message: "Please provide all required fields"
            });
        }

        if (!Number.isFinite(monthlyLimit) || monthlyLimit <= 0) {
            return res.status(400).json({
                message: "Monthly limit must be greater than zero"
            });
        }

        if (!Number.isInteger(month) || month < 1 || month > 12) {
            return res.status(400).json({
                message: "Month must be between 1 and 12"
            });
        }

        if (!Number.isInteger(year) || year < 2000 || year > 2100) {
            return res.status(400).json({
                message: "Invalid year"
            });
        }

        // Check whether category exists and belongs to user
        const category = await Category.findOne({
            _id: categoryId,
            userId: req.user._id,
            type: "expense"
        });

        if (!category) {
            return res.status(404).json({
                message: "Expense category not found"
            });
        }

        // Check duplicate budget
        const existingBudget = await Budget.findOne({
            userId: req.user._id,
            categoryId,
            month,
            year
        });

        if (existingBudget) {
            return res.status(400).json({
                message: "Budget already exists for this category and month"
            });
        }

        const budget = await Budget.create({
            userId: req.user._id,
            categoryId,
            monthlyLimit,
            month,
            year
        });

        res.status(201).json({
            message: "Budget created successfully",
            budget
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// 2. GET ALL BUDGETS WITH EXPENSE DETAILS
const getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({
            userId: req.user._id
        }).populate("categoryId", "name type");

        const result = await Promise.all(
            budgets.map(async (budget) => {

                const startDate = new Date(
                    budget.year,
                    budget.month - 1,
                    1
                );

                const endDate = new Date(
                    budget.year,
                    budget.month,
                    1
                );

                const expenseResult = await Transaction.aggregate([
                    {
                        $match: { //filters transactions based on conditions.
                            userId: req.user._id,
                            categoryId: budget.categoryId._id,
                            type: "expense",
                            date: {
                                $gte: startDate,
                                $lt: endDate
                            }
                        }
                    },
                    {
                        $group: {
                            _id: null, //all matching transactions are grouped together into one result.
                            totalExpense: { $sum: "$amount" }
                        }
                    }
                ]);

                const totalExpense = expenseResult.length > 0
                    ? expenseResult[0].totalExpense : 0;

                const remainingBudget =
                    budget.monthlyLimit - totalExpense;

                const usedPercentage =
                    (totalExpense / budget.monthlyLimit) * 100;

                return {
                    ...budget.toObject(),
                    totalExpense,
                    remainingBudget,
                    usedPercentage: Number(usedPercentage.toFixed(2)),
                    exceeded: totalExpense > budget.monthlyLimit
                };
            })
        );

        res.status(200).json({
            message: "Budgets fetched successfully",
            budgets: result
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// 3. UPDATE BUDGET
const updateBudget = async (req, res) => {
    try {
        const { id } = req.params;
        const { monthlyLimit } = req.body;

        if (!Number.isFinite(monthlyLimit) || monthlyLimit <= 0) {
            return res.status(400).json({
                message: "Monthly limit must be greater than zero"
            });
        }

        const budget = await Budget.findOneAndUpdate(
            {    //search condition
                _id: id,
                userId: req.user._id
            },
            {    // updaye values
                monthlyLimit
            },
            {    //options
                new: true,
                runValidators: true
            }
        );

        if (!budget) {
            return res.status(404).json({
                message: "Budget not found"
            });
        }

        res.status(200).json({
            message: "Budget updated successfully",
            budget
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// 4. DELETE BUDGET
const deleteBudget = async (req, res) => {
    try {
        const budget = await Budget.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!budget) {
            return res.status(404).json({
                message: "Budget not found"
            });
        }

        res.status(200).json({
            message: "Budget deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    createBudget,
    getBudgets,
    updateBudget,
    deleteBudget
};
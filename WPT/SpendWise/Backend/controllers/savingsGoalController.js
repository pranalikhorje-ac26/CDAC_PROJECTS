const SavingsGoal = require("../models/SavingsGoals");

// 1. CREATE SAVINGS GOAL
const createSavingsGoal = async (req, res) => {
    try {
        const { goalName, targetAmount, targetDate, description } = req.body;

        if (!goalName || targetAmount === undefined || !targetDate) {
            return res.status(400).json({
                message: "Goal name, target amount and target date are required"
            });
        }

        if (!Number.isFinite(targetAmount) || targetAmount <= 0) {
            return res.status(400).json({
                message: "Target amount must be greater than zero"
            });
        }

        const parsedDate = new Date(targetDate);

        if (Number.isNaN(parsedDate.getTime())) {
            return res.status(400).json({
                message: "Please provide a valid target date"
            });
        }

        const goal = await SavingsGoal.create({
            userId: req.user._id,
            goalName,
            targetAmount,
            savedAmount: 0,
            targetDate: parsedDate,
            description
        });

        res.status(201).json({
            message: "Savings goal created successfully",
            goal
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// 2. GET ALL SAVINGS GOALS
const getSavingsGoals = async (req, res) => {
    try {
        const goals = await SavingsGoal.find({
            userId: req.user._id
        }).sort({ createdAt: -1 });

        const result = goals.map((goal) => {
            const remainingAmount = Math.max(
                goal.targetAmount - goal.savedAmount,
                0
            );

            const progressPercentage =
                (goal.savedAmount / goal.targetAmount) * 100;

            return {
                ...goal.toObject(),
                remainingAmount,
                progressPercentage: Number(
                    Math.min(progressPercentage, 100).toFixed(2)
                )
            };
        });

        res.status(200).json({
            message: "Savings goals fetched successfully",
            goals: result
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// 3. UPDATE SAVINGS GOAL
const updateSavingsGoal = async (req, res) => {
    try {
        const { id } = req.params;
        const { goalName, targetAmount, targetDate, description } = req.body;

        const goal = await SavingsGoal.findOne({
            _id: id,
            userId: req.user._id
        });

        if (!goal) {
            return res.status(404).json({
                message: "Savings goal not found"
            });
        }

        if (goalName !== undefined) {
            goal.goalName = goalName;
        }

        if (targetAmount !== undefined) {
            if (!Number.isFinite(targetAmount) || targetAmount <= 0) {
                return res.status(400).json({
                    message: "Target amount must be greater than zero"
                });
            }

            if (targetAmount < goal.savedAmount) {
                return res.status(400).json({
                    message: "Target amount cannot be less than saved amount"
                });
            }

            goal.targetAmount = targetAmount;
        }

        if (targetDate !== undefined) {
            const parsedDate = new Date(targetDate);

            if (Number.isNaN(parsedDate.getTime())) {
                return res.status(400).json({
                    message: "Invalid target date"
                });
            }

            goal.targetDate = parsedDate;
        }

        if (description !== undefined) {
            goal.description = description;
        }

        goal.status = goal.savedAmount >= goal.targetAmount
            ? "completed"
            : "active";

        await goal.save();

        res.status(200).json({
            message: "Savings goal updated successfully",
            goal
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// 4. DELETE SAVINGS GOAL
const deleteSavingsGoal = async (req, res) => {
    try {
        const goal = await SavingsGoal.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!goal) {
            return res.status(404).json({
                message: "Savings goal not found"
            });
        }

        res.status(200).json({
            message: "Savings goal deleted successfully"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// 5. ADD MONEY TO SAVINGS GOAL
const addMoneyToSavingsGoal = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount } = req.body;

        if (!Number.isFinite(amount) || amount <= 0) {
            return res.status(400).json({
                message: "Contribution amount must be greater than zero"
            });
        }

        const goal = await SavingsGoal.findOne({
            _id: id,
            userId: req.user._id
        });

        if (!goal) {
            return res.status(404).json({
                message: "Savings goal not found"
            });
        }

        if (goal.status === "completed") {
            return res.status(400).json({
                message: "This savings goal is already completed"
            });
        }

        if (goal.savedAmount + amount > goal.targetAmount) {
            return res.status(400).json({
                message: "Contribution exceeds the remaining target amount"
            });
        }

        // Update total saved amount
        goal.savedAmount += amount;

        // Store individual contribution with date and time
        goal.contributions.push({
            amount: amount,
            date: new Date()
        });

        // Update goal status
        if (goal.savedAmount >= goal.targetAmount) {
            goal.status = "completed";
        }

        await goal.save();

        const remainingAmount = Math.max(
            goal.targetAmount - goal.savedAmount,
            0
        );

        const progressPercentage =
            (goal.savedAmount / goal.targetAmount) * 100;

        res.status(200).json({
            message: "Money added successfully",
            goal,
            remainingAmount,
            progressPercentage: Number(
                Math.min(progressPercentage, 100).toFixed(2)
            )
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    createSavingsGoal,
    getSavingsGoals,
    updateSavingsGoal,
    deleteSavingsGoal,
    addMoneyToSavingsGoal
};
const Category = require("../models/Categories");
const Transaction = require("../models/Transactions");

// 1. CREATE CATEGORY WITH INITIAL TRANSACTION
const createCategory = async (req, res) => {
    let category;

    try {
        const { name, type, description, amount } = req.body;

        if (!name || !name.trim() || !type || amount === undefined) {
            return res.status(400).json({
                message: "Category name, type and amount are required"
            });
        }

        // CATEGORY NAME VALIDATION
        if (!categoryNameRegex.test(name.trim())) {
            return res.status(400).json({
                message: "Category name should contain only letters."
            });
        }

        if (!["income", "expense"].includes(type)) {
            return res.status(400).json({
                message: "Invalid category type"
            });
        }

        const transactionAmount = Number(amount);

        if (!Number.isFinite(transactionAmount) || transactionAmount <= 0) {
            return res.status(400).json({
                message: "Amount must be greater than zero"
            });
        }

        const existingCategory = await Category.findOne({
            name: name.trim(),
            type,
            userId: req.user._id
        });

        if (existingCategory) {
            return res.status(400).json({
                message: "Category already exists"
            });
        }

        // Create category
        category = await Category.create({
            name: name.trim(),
            type,
            description: description?.trim() || "",
            userId: req.user._id
        });

        // Automatically create transaction
        const transaction = await Transaction.create({
            type,
            categoryId: category._id,
            amount: transactionAmount,
            description: description?.trim() || "",
            userId: req.user._id
        });

        res.status(201).json({
            message: "Category and transaction created successfully",
            category,
            transaction
        });

    } catch (error) {

        // Remove category if transaction creation fails
        if (category) {
            await Category.deleteOne({
                _id: category._id,
                userId: req.user._id
            }).catch(() => {});
        }

        res.status(500).json({
            message: error.message
        });
    }
};


// 2. GET ALL CATEGORIES
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({
            userId: req.user._id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            message: "Categories fetched successfully",
            categories
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// 3. UPDATE CATEGORY
const updateCategory = async (req, res) => {
    try {
        const { name, type, description } = req.body;

        if (!name || !name.trim() || !type) {
            return res.status(400).json({
                message: "Category name and type are required"
            });
        }

        // CATEGORY NAME VALIDATION
        if (!categoryNameRegex.test(name.trim())) {
            return res.status(400).json({
                message: "Category name should contain only letters."
            });
        }

        if (!["income", "expense"].includes(type)) {
            return res.status(400).json({
                message: "Invalid category type"
            });
        }

        const existingCategory = await Category.findOne({
            name: name.trim(),
            type,
            userId: req.user._id,
            _id: { $ne: req.params.id }
        });

        if (existingCategory) {
            return res.status(400).json({
                message: "Category already exists"
            });
        }

        const category = await Category.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user._id
            },
            {
                name: name.trim(),
                type,
                description: description?.trim() || ""
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        res.status(200).json({
            message: "Category updated successfully",
            category
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// 4. ADD AMOUNT TO EXISTING CATEGORY
const addAmountToCategory = async (req, res) => {
    try {
        const { amount, description } = req.body;
        const { id } = req.params;

        const transactionAmount = Number(amount);

        if (
            amount === undefined ||
            !Number.isFinite(transactionAmount) ||
            transactionAmount <= 0
        ) {
            return res.status(400).json({
                message: "Amount must be greater than zero"
            });
        }

        const category = await Category.findOne({
            _id: id,
            userId: req.user._id
        });

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        // Create a new transaction for this category
        const transaction = await Transaction.create({
            type: category.type,
            categoryId: category._id,
            amount: transactionAmount,
            description: description?.trim() || "",
            userId: req.user._id
        });

        res.status(201).json({
            message: "Amount added and transaction recorded successfully",
            transaction
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// 5. DELETE CATEGORY
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        res.status(200).json({
            message: "Category deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    createCategory,
    getCategories,
    updateCategory,
    addAmountToCategory,
    deleteCategory
};
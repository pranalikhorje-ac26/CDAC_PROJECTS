const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Users', 
    required: [true, 'Budget must belong to a user']
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categories",
    required: true
  },
  monthlyLimit: {
    type: Number,
    required: [true, 'Monthly limit amount is required'],
    min: [0, 'Monthly limit cannot be negative'] 
  },
  month: {
    type: Number,
    required: [true, 'Month is required'],
    min: [1, 'Month must be between 1 and 12'], 
    max: [12, 'Month must be between 1 and 12'] 
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [2000, 'Year cannot be earlier than 2000'],
    max: [2100, 'Year cannot exceed 2100']
  }
}, {
  timestamps: true, 
  collection: 'budget_collection' 
});

// Prevent duplicate budgets for the same user
budgetSchema.index({ 
  userId: 1,
   categoryId: 1,
    month: 1, 
    year: 1 
  }, 
  { unique: true });

module.exports = mongoose.model(
  'Budget_collections', budgetSchema);

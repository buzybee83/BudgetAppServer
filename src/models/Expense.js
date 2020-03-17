const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    monthTag: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Month'
    },
    budgetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Budget'
    },
    dueDay: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true,
    },
    paycheckTag: String,
    frequency: {
        isRecurring: {
            type: Boolean,
            default: true
        },
        recurringType: {
            type: Number,
            default: 1
        }
    },
    status: {
        type: String,
        default: 'A'
    },
    split: {
        type: Boolean,
        default: false
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    updatedDate: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Expense', expenseSchema);

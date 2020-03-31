const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    budgetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Budget',
        required: true
    },
    name: {
        type: String,
        required: true,
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
    isPaid: {
        type: Boolean,
        default: false
    },
    split: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

mongoose.model('Expense', expenseSchema);

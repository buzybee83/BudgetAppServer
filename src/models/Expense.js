/* 
    VALUE ref
    recurringType = {
        1 : Once a Month
        2 : Twice a Month
        3 : Weekly
        4 : Every Other Month
    }
*/

const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    budgetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Budget',
        required: true
    },
    monthtId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Month',
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

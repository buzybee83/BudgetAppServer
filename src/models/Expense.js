/* 
    VALUE ref
    recurringType = {
        1 : Weekly
        2 : Twice a Month
        3 : Once a Month
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
            default: 3
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

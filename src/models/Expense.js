/* 
    VALUE ref
    recurringType = [Weekly,Twice a Month, Once a Month, Every Other Month]
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
        unique: true
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
            type: String,
            default: 'Once a Month',
            enum: ['Weekly', 'Twice a Month', 'Once a Month', 'Every Other Month']
        }
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    split: {
        type: Boolean,
        default: false
    },
    fixedAmount: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        default: 'A',
        enum: ['A', 'D']
    }    
}, {timestamps: true});

mongoose.model('Expense', expenseSchema);

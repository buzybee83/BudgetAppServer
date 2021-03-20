/* 
    VALUE ref
    incomeType = {
        1 : Paycheck/Recurring
        2 : Misc/One time
    }
*/

const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
    budgetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Budget'
    },
    monthId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Month',
        required: true
    },
    paydayDate: {
        type: Date,
        required: true
    },
    incomeType: {
        type: Number,
        default: 1
    },
    amount: {
        type: Number,
        required: true
    },
    tag: String
}, {timestamps: true});

mongoose.model('Income', incomeSchema);

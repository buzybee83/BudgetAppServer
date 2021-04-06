/* 
    VALUE ref
    incomeType = {
        1 : Paycheck/Recurring
        0 : Misc/One time
    }
*/

const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
    budgetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Budget',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    payday: {
        type: Number,
        require: true
    },
    isAutomated: {
        type: Boolean,
        default: true
    },
    status: {
        type: String,
        default: 'original',
        enum: ['original', 'modified']
    },
    incomeType: {
        type: Number,
        default: 1,
        enum: [0, 1]
    },
    amount: {
        type: Number,
        required: true
    }
    
}, {timestamps: true});

mongoose.model('Income', incomeSchema);

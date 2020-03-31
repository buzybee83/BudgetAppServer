const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
    budgetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Budget'
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
    }
}, {timestamps: true});

mongoose.model('Income', incomeSchema);

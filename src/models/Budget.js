const mongoose = require('mongoose');
const Expense = mongoose.model('Expense');
const Income = mongoose.model('Income');

const monthlySchema = new mongoose.Schema({
    month: {
        name: {
            type: String,
            default: 'January'
        },
        year: {
            type: String,
            default: '2020'
        },
        isCurrentMonth: {
            type: Boolean,
            default: true
        }
    },
    savings: [{
        amount: Number,
        tag: String
    }],
    income: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Income' }],
    expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expense' }],
    totalIncome: Number,
    totalExpenses: Number,
    totalSavings: Number
});

const budgetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true
    },
    projectedSavings: Number,
    monthlyBudget: [monthlySchema],
    settings: {
        firstPayDate: {
            type: String,
            required: true
        },
        incomeType: {
            payFrequency: Number,
            employmentType: Number,
            netAmount: Number
        },
        balanceThresholds: {
            isEnabled: Boolean,
            amount: Number,
            thresholdType: String
        },
        savings: {
            isEnabled: Boolean,
            overrideThresholds: {
                type: Boolean,
                default: false
            },
            allocation: {
                amount: Number,
                amountType: {
                    type: String,
                    default: '$'
                }
            }
        },
    }
}, {timestamps: true});

budgetSchema.methods.getTotalSavings = function (budgetId, callback) {
    const budget = this;
    // return new Promise((resolve, reject) => {
    budget.aggregate(
        [
            // Match to filter possible "documents"
            {
                $match: { budgetId: $budget._id },
            },
            // De-normalize arrays
            { "$unwind": "$monthlyBudget" },
            { "$unwind": "$monthlyBudget.savings" },
            // Group on the "_id" for the "key" you want, or "null" for all
            {
                "$group": {
                    "_id": null,
                    "total": { "$sum": "$monthlyBudget.savings.amount" }
                }
            }
        ],
        function (err, results) {
            console.log('AGGREGATE ERROR === ', err)
            console.log('AGGREGATE RESULTS === ', results)
        }
    );
    // });
}

budgetSchema.methods.getTotalIncome = function () {
    const budget = this;

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const start = new Date(year, month, 1);
    const end = new Date(year, month, 30);

    Income.aggregate([{
        $match: { $and: [{ budgetId: $budget._id }, { paydayDate: { $gte: start, $lt: end } }] },
    }, {
        $group: {
            _id: null,
            monthlyIncome: {
                $sum: "$amount"
            }
        }
    }], function (err, results) {
        console.log('Income AGGREGATE ERROR === ', err)
        console.log('Income AGGREGATE RESULTS === ', results)
    });
}

budgetSchema.methods.getTotalExpenses = function(monthId, callback) {
    const budget = this;

    Expense.aggregate([{
        $match: { $and: [{ budgetId: budget._id }, { monthTag: monthId }] },
    }, {
        $group: {
            _id: null,
            monthlyExpenses: {
                $sum: "$amount"
            }
        }
    }], callback);
}

mongoose.model('Budget', budgetSchema);

// monthSchema.aggregate(
//     [
//         // Match to filter possible "documents"
//         {
//             "$match": {
//                 "userId": "$userId"
//             }
//         },
//         // De-normalize arrays
//         { "$unwind": "$income" },
//         // Group on the "_id" for the "key" you want, or "null" for all
//         {
//             "$group": {
//                 "_id": null,
//                 "totalIncome": { "$sum": "$income.amount" }
//             }
//         }
//     ],
//     function (err, results) {
//         console.log('INCOME AGGREGATE ERROR === ', err)
//         console.log('INCOME AGGREGATE RESULTS === ', results)
//     }
// );




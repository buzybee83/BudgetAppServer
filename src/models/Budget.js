/* 
    VALUE Refs
    SETTINGS:  
        introFlow = 'SKIPPED', 'COMPLETE'
        Savings amountType = '$', '%'
        payFrequency = {
            0: Misc,
            1: Weekly,
            2: Bi-Weekly,
            3: Semi-monthly,
            4: Monthly,
        }
        employmentType = {
            1: Hourly
            2: Salary
            3: Commission 
        } 
        balanceThresholds Type = {
            1: 'Amount',
            2: 'Percentage',
        };
*/

const mongoose = require('mongoose');
const Expense = mongoose.model('Expense');
const Income = mongoose.model('Income');

const monthlySchema = new mongoose.Schema({
	month: {
		name: {
			type: String,
			default: new Date().toLocaleString('default', { month: 'long' })
		},
		year: {
			type: String,
			default: new Date().getFullYear().toLocaleString()
		},
		isCurrentMonth: {
			type: Boolean,
			default: true
		}
	},
	savings: [{
		amount: Number,
		paycheckTag: String
	}],
	income: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Income' }],
	expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expense' }],
	totalIncome: Number,
	totalExpenses: Number,
});

const budgetSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		unique: true,
		required: true
	},
	projectedSavings: Number,
	monthlyBudget: [monthlySchema],
	settings: {
		introStatus: String,
		firstPayDate: Date,
		incomeType: {
			payFrequency: {
				type: Number,
				default: 2
			},
			employmentType: Number,
			netAmount: Number
		},
		balanceThresholds: {
			isEnabled: Boolean,
			amount: Number,
			thresholdType: Number
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
}, { timestamps: true });

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

budgetSchema.methods.getTotalExpenses = function (monthId, callback) {
	const budget = this;

	Expense.aggregate([{
		$match: { $and: [{ budgetId: budget._id }, { monthtId: monthId }] },
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




/* 
    VALUE Refs
    SETTINGS:  
        introFlow = 'SKIPPED', 'COMPLETE'
        Savings amountType = '$', '%'
        payFrequency = [Misc, Weekly, Bi-Weekly, Semi-monthly, Monthly]
        balanceThresholds Type = [%, $]
*/
const mongoose = require('mongoose');
const Expense = mongoose.model('Expense');
const Income = mongoose.model('Income');

const monthlySchema = new mongoose.Schema({
	month: {
		type: Date,
		required: true
	},
	savings: [{
		amount: Number,
		incomeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Income' }
	}],
	active: {
		type: Boolean,
		default: true,
	},
	income: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Income' }],
	expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expense' }],
	totalIncome: Number,
	totalExpenses: Number,
});

mongoose.model('Month', monthlySchema);

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
		showPreview: {
			type: Boolean,
			default: true
		},
		firstPayDate: Date,
		incomeType: {
			payFrequency: {
				type: String,
				default: 'Bi-Weekly',
				emun: ['Misc', 'Weekly', 'Bi-Weekly', 'Semi-Monthly', 'Monthly']
			},
			netAmount: Number
		},
		balanceThresholds: {
			isEnabled: Boolean,
			amount: Number,
			thresholdType:{
				type: String,
				enum: ['$', '%']
			}
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
					default: '%',
					emun: ['%', '$']
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
		(err, results) => {
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
		$match: { $and: [{ budgetId: budget._id }, { paydayDate: { $gte: start, $lt: end } }] },
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

// budgetSchema.methods.pop('findOne', async function() {
// 	const budgetToUpdate = await this.model.findOne(this.getFilter());
// 	console.log('budgetToUpdate >> ', budgetToUpdate)
// 	// Checking current month view + add additional
// 	let monthCount = 0; // We want 3 active months at all times
// 	budgetToUpdate.monthlyBudget = budget.monthlyBudget.map(item => {
// 		const today = new Date();
// 		item.active = !(new Date(item.month).getMonth() < today.getMonth() && new Date(item.month).getFullYear() < today.getFullYear());
// 		if (item.active) monthCount++
// 		return item;
// 	});
	
// 	if (monthCount < 3) {
// 		while (monthCount < 3) {
// 			const newMonth = budgetToUpdate.monthlyBudget[budgetToUpdate.monthlyBudget.length -1];
// 			newMonth.active = true;
// 			newMonth.month = newMonth.month.setMonth(newMonth.month.getMonth() + 1);
// 			delete newMonth._id;
// 			budgetToUpdate.monthlyBudget.push(newMonth);
// 			monthCount++;
// 		}
// 	}
// 	await budgetToUpdate.save();
// });

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




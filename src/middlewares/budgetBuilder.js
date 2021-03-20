// income ref { type: mongoose.Schema.Types.ObjectId, ref: 'Income' }
// expenses ref { type: mongoose.Schema.Types.ObjectId, ref: 'Expense' }
const defaultMonthObject = {
    month: null,
    totalIncome: 0, //Number,
    totalExpenses: 0, //Number,
};

const monthGenerator = (sartMonth) => {
    const maxCount = 3;
    sartMonth = sartMonth || new Date();

    const newMonths = [];
    for (let i = 0; i < maxCount; i++) {
        const tempMonth = JSON.parse(JSON.stringify(defaultMonthObject));
        console.log('DEFAULT MONTH OBJ ==', tempMonth);
        tempMonth.month = sartMonth;
        newMonths.push(tempMonth);
        sartMonth = new Date(sartMonth).setMonth(new Date(sartMonth).getMonth() + 1);
    }
    return newMonths;
};

const BudgetCreator = (req, res, next) => {
    let today = new Date();
    const skipMonth = (((new Date(today.getFullYear(), today.getMonth()+1, 0).getDate()) - today.getDate()) < 7);
    // If only 7 days left in month, we'll start budget the next month
    if (skipMonth) {
        today = new Date().setMonth(today.getMonth() + 1);
    }
    const monthlyBudget = monthGenerator(today);
    const newBudget = {
        userId: req.user.id,
        monthlyBudget,
        ...req.body
    };

    req.body = newBudget;

    next();
};

module.exports = { 
    BudgetCreator,
    monthGenerator
};

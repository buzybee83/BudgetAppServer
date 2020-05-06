const savings = {
    amount: null, // Number
    paycheckTag: null //String
}
const monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
// income ref { type: mongoose.Schema.Types.ObjectId, ref: 'Income' }
// expenses ref { type: mongoose.Schema.Types.ObjectId, ref: 'Expense' }
const monthSchema = {
    month: {
        name: null,//type: String, default: new Date().toLocaleString('default', { month: 'long' })
        year: null, //type: String, default: new Date().getFullYear().toLocaleString()
        isCurrentMonth: true // type: Boolean, default: true
    },
    totalIncome: 0, //Number,
    totalExpenses: 0, //Number,
};

const weekCount = (year, monthNum, startDayOfWeek) => {
    // monthNum is in the range 0..11

    // Get the first day of week week day (0: Sunday, 1: Monday, ...)
    const firstDayOfWeek = startDayOfWeek || 0;

    const firstOfMonth = new Date(year, monthNum, 1);
    const lastOfMonth = new Date(year, monthNum, 0);
    const numberOfDaysInMonth = lastOfMonth.getDate();
    const firstWeekDay = (firstOfMonth.getDay() - firstDayOfWeek + 7) % 7;

    const used = firstWeekDay + numberOfDaysInMonth;

    return Math.ceil(used / 7);
}
/*
    @frequency values
    1: 'Weekly',
    2: 'Bi-Weekly',
    3: 'Semi-monthly',
    4: 'Monthly'
*/
const daysPerPaycheck = [7, 14, 15, 30]
const setupSavings = (data, weeksInMonth) => {
    const firstPayDate = data.settings.firstPayDate;
    const payDay = new Date(data.settings.firstPayDate).getDay();
    let daysInWeek = 7;
    const frequency = data.settings.incomeType.payFrequency;

    switch (frequency) {
        case 1:
            count;
            break;
        case 2:
            count = daysInWeek;
            break;
        case 3:
            count = cout / 2;

    }
}

module.exports = (req, res, next) => {
    const today = new Date();
    const year = today.getFullYear();

    let month = today.getMonth();

    const monthlyBudget = [];
    for (let i = 0; i < 3; i++) {
        const tempMonth = JSON.parse(JSON.stringify(monthSchema));
        console.log('DEFAULT MONTH OBJ ==', tempMonth);
        tempMonth.month.isCurrentMonth = i > 0? false : true;
        tempMonth.month.name = monthName[month];
        tempMonth.month.year = year;
        monthlyBudget.push(tempMonth);
        weeksInMonth = weekCount(year, month)
        console.log(`${weeksInMonth} Weeks in month ${month}`)
        /* Update weeks count for next month */
        month++;
    }

    console.log('Months BUILT >> ', monthlyBudget)
    const newBudget = {
        userId: req.user.id,
        monthlyBudget,
        ...req.body
    };

    req.body = newBudget;

    next();
};
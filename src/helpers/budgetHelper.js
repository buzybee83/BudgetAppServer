
const savings = {
    amount: null, // Number
    paycheckTag: null //String
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

var holidayPayRules = {
    BEFORE: 'BEFORE',
    AFTER: 'AFTER'
};

const holidays = [
    { name: 'Martin Luther King, Jr. Day', date: new Date('01-18-2016', 'MM-DD-YYYY') },
    { name: 'George Washington\'s Birthday', date: new Date('02-15-2016', 'MM-DD-YYYY') },
    { name: 'Memorial Day', date: new Date('05-30-2016', 'MM-DD-YYYY') },
    { name: 'Independence Day', date: new Date('07-04-2016', 'MM-DD-YYYY') },
    { name: 'Labor Day', date: new Date('09-05-2016', 'MM-DD-YYYY') },
    { name: 'Columbus Day', date: new Date('10-10-2016', 'MM-DD-YYYY') },
    { name: 'Christmas Day', date: new Date('12-26-2016', 'MM-DD-YYYY') },
    { name: 'Thanksgiving Day', date: new Date('11-24-2016', 'MM-DD-YYYY') },
    { name: 'New Years Day', date: new Date('01-01-2016', 'MM-DD-YYYY') },
    { name: 'Veterans Day', date: new Date('11-11-2016', 'MM-DD-YYYY') },
    { name: 'New Years Day', date: new Date('01-01-2017', 'MM-DD-YYYY') },
];

var payDays = [15, 30]; // Optional - Required for payroll period of Semi-Monthly

/**
 * @function nextPayDate - Calculates the next pay date given a previous pay date
 * @param {string} payrollPeriods - A string representation of payroll periods (WEEKLY|BIWEEKLY|SEMI_MONTHLY|MONTHLY)
 * @param {string} lastPayDay - A date in string format (MM-DD-YYYY), which represents the last pay date.
 * @param {string} holidayPayRule - A string representation of holiday pay rules (BEFORE|AFTER)
 * @param {number[]} [payDays] - An optional array of two numbers representing dates which payroll is run each month
 * @return {string} - A date in string format, which represents the calculated pay date.
 */
function nextPayDate(payrollPeriods, lastPayDay, holidayPayRule, payDays) {
    var d = new Date(lastPayDay);
    var dayOfWeek = d.clone().format('dddd');
    var payDate;

    switch (payrollPeriods) {
        case payPeriodOptions.WEEKLY:
            payDate = d.clone().add(1, 'weeks');
            break;
        case payPeriodOptions.BIWEEKLY:
            payDate = d.clone().add(2, 'weeks');
            break;
        case payPeriodOptions.SEMI_MONTHLY: 
            if (holidayPayRule === holidayPayRules.BEFORE) {
                /* 
                If lastPayDay (d) is the same or before the first pay day of the month
                then keep the month the same and change the day to be the second pay day
                of the month, unless that pay day is greater than the days in the the month
                then use the last day of the month (Example: 15, 30 - Feb. 28)
                */
                payDate = (d.isSameOrBefore(d.clone().date(payDays[0])) ?
                    (d.clone().endOf('month').isBefore(d.clone().date(payDays[1])) ?
                        d.clone().endOf('month') :
                        d.clone().date(payDays[1])) :
                    d.clone().date(payDays[0]).add(1, 'months'));
                /* 
                If the last pay date was the previous month because of holiday or weekend
                then set the new date to be the second pay date of that month
                */
                if (d.isAfter(d.clone().date(payDays[1])) && d.date() !== payDays[1]) {
                    payDate.date(payDays[1]);
                }
            } else {
                payDate = (d.isSameOrAfter(d.clone().date(payDays[0])) && d.date() < payDays[1] ? d.clone().date(payDays[1]) : d.clone().date(payDays[0]).add(1, 'months'));
            }
            break;
        case payPeriodOptions.MONTHLY: {
            payDate = d.clone().add(1, 'months').endOf('month');
            break;
        }
    }
    return payDate.format();
}

/**
 * @function checkDate - Checks next pay date if it falls on a weekend or a holiday
 * @param {string} date - A date in string format (MM-DD-YYYY), which represents the calculated pay date.
 * @param {{key: {{name: String, date: String}[]}}} holidays - An object of days with applicable holidays.
 * @param {string} holidayPayRule - A string representation of holiday pay rules (BEFORE|AFTER)
 * @return {string} - A date in string format, which represents the calculated pay date.
 */
function checkDate(date, holidays, holidayPayRule) {
    var d = new Date(date);
    var dayOfWeek = d.clone().format('dddd');

    if (dayOfWeek === 'Saturday') {
        d = (holidayPayRule === holidayPayRules.AFTER ? d.add(2, 'days') : d.add(-1, 'days'));
    } else if (dayOfWeek === 'Sunday') {
        d = (holidayPayRule === holidayPayRules.AFTER ? d.add(1, 'days') : d.add(-2, 'days'));
    }

    if (typeof holidays.find(h => h.date.isSame(d, 'day')) !== 'undefined') {
        switch (dayOfWeek) {
            case 'Monday':
                d = (holidayPayRule === holidayPayRules.AFTER ? d.add(1, 'days') : d.add(-3, 'days'));
                break;
            case 'Friday':
                d = (holidayPayRule === holidayPayRules.AFTER ? d.add(3, 'days') : d.add(-1, 'days'));
                break;
            case 'Thursday':
                d = (holidayPayRule === holidayPayRules.AFTER ? d.add(1, 'days') : d.add(-1, 'days'));
                break;
        }
    }
    return d.format();
}

/**
 * @function generatePaySchedule - Returns a pay schedule for a year
 * @param {string} payrollPeriods - A string representation of payroll periods (WEEKLY|BIWEEKLY|SEMI_MONTHLY|MONTHLY)
 * @param {string} nextPayDay - A date in string format (MM-DD-YYYY), which represents the next (non-holiday) pay date.
 * @param {{key: {{name: String, date: String}[]}}} holidays - An object of days with applicable holidays.
 * @param {string} holidayPayRule - A string representation of holiday pay rules (BEFORE|AFTER)
 * @param {number[]} [payDays] - An optional array of two numbers representing dates which payroll is run each month
 * @return {string[]} - An array of date strings representing the appropriate payroll schedule
 */
function generatePaySchedule(payrollPeriods, nextPayDay, holidays, holidayPayRule, payDays) {
    if (payrollPeriods === payPeriodOptions.SEMI_MONTHLY && !payDays) {
        console.error('For a Semi-Monthly payroll period, an array of two dates must be passed into generatePaySchedule');
        return;
    }
    var payPeriods = [];
    payPeriods.push(new Date(nextPayDay).format('MM-DD-YYYY'));
    var lastPayDay = nextPayDay;

    for (var i = 0; i < 12; i++) {
        var payDates = checkDate(nextPayDate(payrollPeriods, lastPayDay, holidayPayRule, payDays), holidays, holidayPayRule);
        payPeriods.push(new Date(payDates).format('MM-DD-YYYY'));
        lastPayDay = payDates;
    }
    return payPeriods;
}

// TODO: look up/add payPeriodOptions
// const weekly = generatePaySchedule(payPeriodOptions.WEEKLY, new Date('10-07-2016', 'MM-DD-YYYY'), holidays, holidayPayRules.BEFORE);
// const biWeekly = generatePaySchedule(payPeriodOptions.BIWEEKLY, new Date('10-07-2016', 'MM-DD-YYYY'), holidays, holidayPayRules.BEFORE);
// const semiMonthly = generatePaySchedule(payPeriodOptions.SEMI_MONTHLY, new Date('10-15-2016', 'MM-DD-YYYY'), holidays, holidayPayRules.BEFORE, payDays);
// const monthly = generatePaySchedule(payPeriodOptions.MONTHLY, new Date('10-31-2016', 'MM-DD-YYYY'), holidays, holidayPayRules.BEFORE);

module.exports = {
    nextPayDate,
    checkDate,
    generatePaySchedule,
    // weekly,
    // biWeekly,
    // semiMonthly,
    // monthly
};
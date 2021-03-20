const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');
const { BudgetCreator } = require('../middlewares/budgetBuilder');

const User = mongoose.model('User');
const Budget = mongoose.model('Budget');

const router = express.Router();

router.use(requireAuth);

router.get('/api/budget', async (req, res) => {
    console.log('***REQUESTING BUDGET***', req.user);
    const budgetId = req.user.budgetId;
    try {
        const budget = await Budget.findById(budgetId).exec();
        budget.
            populate({
                path: 'monthlyBudget.expenses',
                model: 'Expense'
            }).
            populate({
                path: 'monthlyBudget.income',
                model: 'Income'
            }).
            execPopulate();
        console.log('SENDING BUDGET', budget);
        res.send(budget);
    }
    catch (err) {
        if (err) res.status(422).send({ error: err.message });
    }
            
});

router.post('/api/budget', BudgetCreator, async (req, res) => {
    console.log('BUDGET BUILT === ', req.body)
    const userQuery = { _id: req.user.id };
    try {
        const budget = new Budget(req.body);
        await budget.save();
        await User.findOneAndUpdate(userQuery,
            { $set: { "budgetId": budget._id } }
        );
        res.send(budget);
    } catch (err) {
        console.error('Budget Creation has an error. ', err.message)
        res.status(422).send({ error: err.message });
    }
});

router.post('/api/budget/:id', async (req, res) => {
    const query = { _id: req.params.id, userId: req.user._id };
    console.log('RECEIVED UPDATED BUDGET >> ', req.body)

    try {
        const budget = await Budget.
            findOneAndUpdate(query,
                { $set: req.body },
                { new: true }
            );
        res.send(budget);
    } catch (err) {
        res.status(422).send({ error: err.message });
    }
});

module.exports = router;

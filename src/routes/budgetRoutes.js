const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');
const budgetBuilder = require('../middlewares/budgetBuilder');

const User = mongoose.model('User');
const Budget = mongoose.model('Budget');

const router = express.Router();

router.use(requireAuth)

router.get('/api/budget', async (req, res) => {
    console.log('REQUESTING BUDGET');
    Budget.findById(req.user.budget).
        populate({
            path: 'monthlyBudget.expenses',
            model: 'Expense'
        }).
        populate({
            path: 'monthlyBudget.income',
            model: 'Income'
        }).
        exec(function (err, budget) {
            if (err) res.status(422).send({ error: err.message });

            console.log('SENDING BUDGET', budget);
            res.send(budget);
        });
});

router.post('/api/budget', budgetBuilder, async (req, res) => {
    console.log('BUDGET BUILT === ', req.body)
    const userQuery = { _id: req.user.id };
    try {
        const budget = new Budget(req.body);
        await budget.save();
        await User.findOneAndUpdate(userQuery,
            { $set: { "budget": budget._id } }
        );
        res.send(budget);
    } catch (err) {
        console.error(err)
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

const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');

const Budget = mongoose.model('Budget');
const Expense = mongoose.model('Expense');

const router = express.Router();

router.use(requireAuth)

router.get('/api/budget', (req, res) => {
    Budget.
        findOne({ userId: req.user._id }).
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

            res.send(budget);
        });
});

router.post('/api/budget', async (req, res) => {
    try {
        const budget = new Budget(req.body);
        await budget.save();
        res.send(budget);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

router.post('/api/budget/:id', async (req, res) => {
    const query = { _id: req.params.id, userId: req.user._id };
    try {
        const budget = await Budget.
            findOneAndUpdate(query, 
                { $set: req.body }, 
                { new: true } 
            );
        res.send(budget);
    } catch(err) {
        res.status(500).send({ error: err.message });
    }
});

module.exports = router;

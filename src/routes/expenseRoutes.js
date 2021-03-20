const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');

const Budget = mongoose.model('Budget');
const Expense = mongoose.model('Expense');

const router = express.Router();

router.use(requireAuth)

router.get('/api/:budgetId/expenses', async (req, res) => {
    console.log('###API REQUESTING EXPENSES###', req.user);

    try {
        const expenses = await Expense.find({ budgetId: req.params.budgetId });
        res.send(expenses);
    } catch(err) {
        res.status(500).send({ error: err.message });
    }
});

router.post('/api/:budgetId/expense', async (req, res) => {
    console.log('###API CREATING EXPENSE ### ', req.body);
    
    const query = { _id: req.params.budgetId };
    try {
        // req.body.budgetId = req.params.budgetId;
        const expense = new Expense(req.body);
        await expense.save();
        const budget = await Budget.findOne(query);
        console.log('BUDGET>> ',budget)
        // budget.expenses.push(expense._id);
        // await budget.save();

        res.send(expense);
    } catch (err) {
        console.log('ERROR == ', err)
        res.status(500).send({ error: err.message });
    }
});

router.get('/api/:budgetId/expense/:id', async (req, res) => {
    console.log('###API REQUESTING EXPENSE BY ID###');

    try {
        const expense = await Expense.find({ budgetId: req.params.budgetId, _id: req.params.id });
        if (!expense) return res.status(404).send({ error: `Expense with ID: ${req.params.id} was not found.` });
        
        res.send(expense);
    } catch(err) {
        res.status(500).send({ error: err.message });
    }
});

router.post('/api/:budgetId/expense/:id', async (req, res) => {
    console.log('###API UPDATING EXPENSE BY ID### ', req.body);

    const query = { _id: req.params.id, budgetId: req.params.budgetId };
    try {
        const expense = await Expense.
            findOneAndUpdate(query, 
                { $set: req.body }, 
                { new: true } 
            );
        if (!expense) return res.status(404).send({ error: `Expense with ID: ${req.params.id} was not found.` });
        
        res.send(expense);
    } catch(err) {
        res.status(500).send({ error: err.message });
    }
});

// TODO: Figure out if there's a need to do a mass update 
router.post('/api/:budgetId/expenses:filter', async (req, res) => {
    const expenses = await Expense.find({ budgetId: req.params.budgetId });
});

router.delete('/api/:budgetId/expense/:id', async (req, res) => {
    try {
        const expense = await Expense.findByIdAndDelete(req.params.id);
        if (!expense) return res.status(404).send({ error: `Expense with ID: ${req.params.id} was not found.` });
        
        res.status(204).send('Expense successfully deleted');
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

module.exports = router;

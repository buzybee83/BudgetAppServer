const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');

const Budget = mongoose.model('Budget');
const Income = mongoose.model('Income');

const router = express.Router();

router.use(requireAuth)

router.get('/api/:budgetId/income', async (req, res) => {
    try {
        const income = await Income.find({ budgetId: req.params.budgetId });
        res.send(income);
    } catch(err) {
        res.status(500).send({ error: err.message });
    }
});

router.post('/api/:budgetId/income', async (req, res) => {
    try {
        req.body.budgetId = req.params.budgetId;
        const income = new Income(req.body);
        await income.save();
        res.send(income);
    } catch (err) {
        console.log('ERROR == ', err)
        res.status(500).send({ error: err.message });
    }
});

router.post('/api/:budgetId/income/:id', async (req, res) => {
    const query = { _id: req.params.id, budgetId: req.params.budgetId };
    try {
        const income = await Income.
            findOneAndUpdate(query, 
                { $set: req.body }, 
                { new: true } 
            );
        if (!income) return res.status(404).send({ error: `Income with ID: ${req.params.id} was not found.` });
        
        res.send(income);
    } catch(err) {
        res.status(500).send({ error: err.message });
    }
});

// TODO: Figure out if there's a need to do a mass update
router.post('/api/:budgetId/income:filter', async (req, res) => {
    const expense = await Income.find({ budgetId: req.params.budgetId });
});

router.delete('/api/:budgetId/income/:id', async (req, res) => {
    try {
        const income = await Income.findByIdAndDelete(req.params.id);
        if (!income) return res.status(404).send({ error: `Expense with ID: ${req.params.id} was not found.` });
        
        res.status(204).send('Income successfully deleted');
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

module.exports = router;

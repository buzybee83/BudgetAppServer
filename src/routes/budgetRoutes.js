const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');

const Budget = mongoose.model('Budget');
// const Expense = mongoose.model('Expense');

const router = express.Router();

router.use(requireAuth)

router.get('/api/budget', async (req, res) => {
    const budget = await Budget.find({ userId: req.user._id });
    res.send(budget);
});

router.post('api/budget', async (req, res) => {
    const { name, locations } = req.body;

    if (!name || !locations) {
        return res
            .status(422)
            .send({ error: 'You must provide a name and locations' });
    }

    try {
        const track = new Budget({ name, locations, userId: req.user._id });
        await track.save();
        res.send(track);
    } catch (err) {
        res.status(422).send({ error: err.message });
    }
});

module.exports = router;

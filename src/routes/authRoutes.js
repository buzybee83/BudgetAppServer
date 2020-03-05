const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');

const router = express.Router();

// router.get(
//     '/auth/google',
//     passport.authenticate('google', {
//         scope: ['profile', 'email']
//     })
// );

// router.get(
//     '/auth/google/callback',
//     passport.authenticate('google'),
//     (req, res) => {
//         res.redirect('/surveys');
//     }
// );

router.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

router.get('/api/current_user', (req, res) => {
    res.send(req.user);
});

router.post('/signup', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        const user = new User({ firstName, lastName, email, password });
        await user.save();
        const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY');
        res.send({ token, firstName, lastName });
    } catch (err) {
        return res.status(422).send(err);
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(422).send({ error: 'Must provide email & password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).send({ error: 'Invalid email or password.' });
    }
    
    try {
        await user.comparePasswords(password);
        const { firstName, lastName } = user;
        const token = jwt.sign({ userId: user._id}, 'MY_SECRET_KEY');
        res.send({ token, firstName, lastName });
    } catch (err) {
        return res.status(404).send({ error: 'Invalid email or password.' });
    }
    
});

module.exports = router;

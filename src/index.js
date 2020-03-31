require('./models/User');
require('./models/Expense');
require('./models/Income');
require('./models/Budget');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
const authRoutes = require('./routes/authRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const requireAuth = require('./middlewares/requireAuth');

const app = express();

app.use(bodyParser.json());
app.use(authRoutes);
app.use(budgetRoutes);
app.use(expenseRoutes);

const mongoUri = keys.mongoURI;
if (!mongoUri) {
    throw new Error(
        `MongoURI was not supplied. Please check your settings!`
    );
}

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(
    () => { console.log('Connected to mongo instance!'); },
    err => { console.error('Error connecting to mongoDB: ', err); }
);

app.get('/', requireAuth, (req, res) => {
    res.send(`Your email: ${req.user.email}`);
});

if (process.env.NODE_ENV === 'production') {
    // Express will serve up production assets
    // like our main.js file, or main.css file!
    app.use(express.static('client/build'));

    // Express will serve up the index.html file
    // if it doesn't recognize the route
    const path = require('path');
    app.get('*', requireAuth, (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Listening on port 3000');
});


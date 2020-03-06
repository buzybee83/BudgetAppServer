require('./models/User');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
const authRoutes = require('./routes/authRoutes');
const requireAuth = require('./middlewares/requireAuth');

const app = express();

app.use(bodyParser.json());
app.use(authRoutes);

const mongoUri = keys.mongoURI;
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => { console.log('Connected to mongo instance!'); });
mongoose.connection.on('error', (err) => { console.error('Error  connecting to mongo: ', err); });

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


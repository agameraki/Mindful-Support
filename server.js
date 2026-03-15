const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const moodRoutes = require('./routes/moodRoutes');
const journalRoutes = require('./routes/journalRoutes');
const resourcesRoutes = require('./routes/resourcesRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

app.use('/', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/mood', moodRoutes);
app.use('/journal', journalRoutes);
app.use('/resources', resourcesRoutes);
app.use('/settings', settingsRoutes);

app.get('/', (req, res) => {
    if (req.session.isLoggedIn) {
        return res.redirect('/dashboard');
    }
    res.render('index-new');
});

app.listen(PORT, async () => {
    try {
        await db.connectDB();
        console.log('🚀 Server running on http://localhost:' + PORT);
    } catch (err) {
        console.error('Failed to start server:', err);
    }
});
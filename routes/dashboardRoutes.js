const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');

router.get('/', isAuthenticated, async (req, res) => {
    try {
        res.render('dashboard', {
            title: 'Dashboard',
            username: req.session.username,
            avatar: req.session.avatar || 'cat',
            theme: req.session.theme || 'light'
        });
    } catch (err) {
        console.error('Dashboard error:', err);
        res.redirect('/login');
    }
});

module.exports = router;

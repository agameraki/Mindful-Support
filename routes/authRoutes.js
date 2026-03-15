const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Settings = require('../models/Settings');
const { isNotAuthenticated } = require('../middleware/auth');

router.get('/login', isNotAuthenticated, (req, res) => {
    res.render('login', {
        title: 'Login',
        error: req.query.error || null,
        success: req.query.success || null
    });
});

router.post('/login', isNotAuthenticated, async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByEmail(email);
        
        if (!user) {
            return res.redirect('/login?error=Invalid email or password');
        }
        
        const isValid = await User.verifyPassword(password, user.password_hash);
        if (!isValid) {
            return res.redirect('/login?error=Invalid email or password');
        }
        
        // Get user settings including theme
        const settings = await Settings.getUserSettings(user.id);
        
        req.session.isLoggedIn = true;
        req.session.userId = user._id.toString();
        req.session.username = user.username;
        req.session.avatar = user.avatar || 'cat';
        req.session.theme = (settings && settings.theme) || 'light';
        
        res.redirect('/dashboard');
    } catch (err) {
        console.error('Login error:', err);
        res.redirect('/login?error=An error occurred');
    }
});

router.get('/signup', isNotAuthenticated, (req, res) => {
    res.render('signup', {
        title: 'Sign Up',
        error: null
    });
});

router.post('/signup', isNotAuthenticated, async (req, res) => {
    try {
        const { email, username, password } = req.body;
        
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.redirect('/signup?error=Email already registered');
        }
        
        await User.create(email, username, password);
        res.redirect('/login?success=Account created! Please login');
    } catch (err) {
        console.error('Signup error:', err);
        res.redirect('/signup?error=An error occurred');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

module.exports = router;

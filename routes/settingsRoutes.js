const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const User = require('../models/User');
const Settings = require('../models/Settings');
const { ObjectId } = require('mongodb');

// Available avatar options
const avatars = [
    'cat', 'dog', 'bear', 'fox', 'rabbit', 'panda',
    'koala', 'owl', 'penguin', 'lion', 'tiger', 'elephant',
    'dolphin', 'butterfly', 'bird', 'fish', 'turtle', 'frog',
    'bee', 'ladybug'
];

// GET settings page
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const userId = new ObjectId(req.session.userId);
        const user = await User.findById(userId);
        if (!user) {
            return res.redirect('/login?error=User not found. Please log in again.');
        }
        const settings = await Settings.getUserSettings(userId);
        
        res.render('settings', {
            title: 'Settings',
            user,
            settings: settings || {},
            avatars,
            error: req.query.error || null,
            success: req.query.success || null
        });
    } catch (err) {
        console.error('Settings page error:', err);
        res.redirect('/dashboard');
    }
});

// POST update profile
router.post('/profile', isAuthenticated, async (req, res) => {
    try {
        const userId = new ObjectId(req.session.userId);
        const { username, email } = req.body;
        
        await User.update(userId, { username, email });
        req.session.username = username;
        
        res.redirect('/settings?success=Profile updated!');
    } catch (err) {
        console.error('Update profile error:', err);
        res.redirect('/settings?error=Failed to update profile');
    }
});

// POST update avatar
router.post('/avatar', isAuthenticated, async (req, res) => {
    try {
        const userId = new ObjectId(req.session.userId);
        const { avatar } = req.body;
        
        console.log('Avatar update request:', { userId, avatar });
        
        await User.updateAvatar(userId, avatar);
        req.session.avatar = avatar;
        
        res.redirect('/settings?success=Avatar updated!');
    } catch (err) {
        console.error('Update avatar error:', err);
        res.redirect('/settings?error=Failed to update avatar');
    }
});

// POST change password
router.post('/password', isAuthenticated, async (req, res) => {
    try {
        const userId = new ObjectId(req.session.userId);
        const { current_password, new_password, confirm_password } = req.body;
        
        if (new_password !== confirm_password) {
            return res.redirect('/settings?error=Passwords do not match');
        }
        
        const user = await User.findById(userId);
        const fullUser = await User.findByEmail(user.email);
        const isValid = await User.verifyPassword(current_password, fullUser.password_hash);
        
        if (!isValid) {
            return res.redirect('/settings?error=Current password is incorrect');
        }
        
        await User.updatePassword(userId, new_password);
        res.redirect('/settings?success=Password changed successfully!');
    } catch (err) {
        console.error('Change password error:', err);
        res.redirect('/settings?error=Failed to change password');
    }
});

// POST update theme
router.post('/theme', isAuthenticated, async (req, res) => {
    try {
        const userId = new ObjectId(req.session.userId);
        const { theme } = req.body;
        
        console.log('Theme update request:', { userId, theme });
        
        await Settings.updateTheme(userId, theme);
        req.session.theme = theme;
        
        res.redirect('/settings?success=Theme updated!');
    } catch (err) {
        console.error('Theme error:', err);
        res.redirect('/settings?error=Failed to update theme');
    }
});

module.exports = router;

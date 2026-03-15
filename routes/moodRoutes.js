const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const Mood = require('../models/Mood');
const Settings = require('../models/Settings');
const { ObjectId } = require('mongodb');

router.get('/checkin', isAuthenticated, async (req, res) => {
    try {
        const userId = new ObjectId(req.session.userId);
        const settings = await Settings.getUserSettings(userId);
        res.render('mood-checkin', {
            title: 'Mood Check-in',
            theme: req.session.theme || 'light',
            settings: settings || {},
            error: null,
            success: null
        });
    } catch (err) {
        console.error('Mood checkin render error:', err);
        res.render('mood-checkin', {
            title: 'Mood Check-in',
            theme: req.session.theme || 'light',
            settings: {},
            error: null,
            success: null
        });
    }
});

router.post('/checkin', isAuthenticated, async (req, res) => {
    try {
        const userId = new ObjectId(req.session.userId);
        const { mood_score, emotions, triggers, notes } = req.body;
        
        await Mood.create(userId, {
            mood_score: parseInt(mood_score),
            emotions,
            triggers,
            notes,
            entry_date: new Date()
        });
        
        res.redirect('/dashboard?success=Mood checked in!');
    } catch (err) {
        console.error('Mood checkin error:', err);
        res.redirect('/mood/checkin?error=Failed to save mood');
    }
});

router.get('/history', isAuthenticated, async (req, res) => {
    try {
        const userId = new ObjectId(req.session.userId);
        const moodHistory = await Mood.getAllByUser(userId);
        const settings = await Settings.getUserSettings(userId);
        
        res.render('mood-history', {
            title: 'Mood History',
            theme: req.session.theme || 'light',
            settings: settings || {},
            moodHistory
        });
    } catch (err) {
        console.error('Mood history error:', err);
        res.redirect('/dashboard');
    }
});

module.exports = router;
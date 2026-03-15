const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const Journal = require('../models/Journal');
const Settings = require('../models/Settings');
const { ObjectId } = require('mongodb');

router.get('/', isAuthenticated, async (req, res) => {
    try {
        const userId = new ObjectId(req.session.userId);
        const journals = await Journal.getAllByUser(userId);
        const settings = await Settings.getUserSettings(userId);
        
        res.render('journal', {
            title: 'My Journal',
            theme: req.session.theme || 'light',
            settings: settings || {},
            journals
        });
    } catch (err) {
        console.error('Journal list error:', err);
        res.redirect('/dashboard');
    }
});

router.get('/new', isAuthenticated, async (req, res) => {
    try {
        const userId = new ObjectId(req.session.userId);
        const settings = await Settings.getUserSettings(userId);
        res.render('journal-new', {
            title: 'New Journal Entry',
            theme: req.session.theme || 'light',
            settings: settings || {},
            error: null
        });
    } catch (err) {
        console.error('Journal new render error:', err);
        res.render('journal-new', {
            title: 'New Journal Entry',
            theme: req.session.theme || 'light',
            settings: {},
            error: null
        });
    }
});

router.post('/new', isAuthenticated, async (req, res) => {
    try {
        const userId = new ObjectId(req.session.userId);
        const { title, content, mood_score, tags } = req.body;
        
        await Journal.create(userId, {
            title,
            content,
            mood_score: mood_score ? parseInt(mood_score) : null,
            tags
        });
        
        res.redirect('/journal?success=Journal created!');
    } catch (err) {
        console.error('Create journal error:', err);
        res.redirect('/journal/new?error=Failed to create journal');
    }
});

router.get('/:id', isAuthenticated, async (req, res) => {
    try {
        const userId = new ObjectId(req.session.userId);
        const journalId = req.params.id;
        const settings = await Settings.getUserSettings(userId);
        
        const journal = await Journal.getById(journalId, userId);
        
        if (!journal) {
            return res.redirect('/journal?error=Journal not found');
        }
        
        res.render('journal-view', {
            title: journal.title,
            theme: req.session.theme || 'light',
            settings: settings || {},
            journal
        });
    } catch (err) {
        console.error('View journal error:', err);
        res.redirect('/journal');
    }
});

module.exports = router;
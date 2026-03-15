
const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const Settings = require('../models/Settings');
const { ObjectId } = require('mongodb');

router.get('/', isAuthenticated, async (req, res) => {
    try {
        const userId = new ObjectId(req.session.userId);
        const settings = await Settings.getUserSettings(userId);
        res.render('resources-menu', {
            title: 'Resources',
            theme: req.session.theme || 'light',
            settings: settings || {}
        });
    } catch (err) {
        console.error('Resources menu error:', err);
        res.render('resources-menu', {
            title: 'Resources',
            theme: req.session.theme || 'light',
            settings: {}
        });
    }
});

router.get('/crisis', isAuthenticated, async (req, res) => {
    try {
        const userId = new ObjectId(req.session.userId);
        const settings = await Settings.getUserSettings(userId);
        
        // Hardcoded crisis resources (replace with DB later if needed)
        const resources = [
            { name: 'National Suicide Prevention Lifeline', contact: '988', description: '24/7 support for crisis situations' },
            { name: 'Crisis Text Line', contact: 'Text HOME to 741741', description: 'Free 24/7 crisis counseling via text' },
            { name: 'International Association for Suicide Prevention', contact: 'befrienders.org', description: 'Global network of suicide prevention services' },
            { name: 'Befrienders Worldwide', contact: 'befrienders.org', description: 'International suicide prevention organization' },
            { name: 'Mental Health America', contact: 'mhanational.org', description: 'Mental health screening and resources' },
            { name: 'NAMI Helpline', contact: '1-800-950-NAMI', description: 'National Alliance on Mental Illness support' },
            { name: 'SAMHSA Treatment Locator', contact: 'samhsa.gov', description: 'Find treatment facilities and resources' },
            { name: 'Crisis Intervention Services', contact: 'Local emergency services', description: 'Immediate crisis intervention' },
            { name: 'RAINN (Rape, Abuse & Incest National Network)', contact: 'rainn.org', description: 'Support for sexual assault survivors' }
        ];
        
        res.render('resources-crisis', {
            title: 'Crisis Resources',
            theme: req.session.theme || 'light',
            settings: settings || {},
            resources
        });
    } catch (err) {
        console.error('Error:', err);
        res.redirect('/resources');
    }
});

router.get('/breathing', isAuthenticated, async (req, res) => {
    try {
        const userId = new ObjectId(req.session.userId);
        const settings = await Settings.getUserSettings(userId);
        
        const resources = [
            { name: '4-7-8 Breathing', description: 'Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds. Repeat 4 times.' },
            { name: 'Box Breathing', description: 'Inhale for 4, hold for 4, exhale for 4, hold for 4. Repeat 4-5 times.' },
            { name: 'Diaphragmatic Breathing', description: 'Place one hand on belly, inhale deeply through nose, exhale slowly through mouth.' },
            { name: 'Pursued Lip Breathing', description: 'Inhale through nose, exhale slowly through pursed lips as if blowing out a candle.' },
            { name: 'Alternate Nostril Breathing', description: 'Close right nostril, inhale left, close left, exhale right. Alternate.' },
            { name: 'Resonant Breathing', description: 'Inhale for 5 seconds, exhale for 5 seconds. Maintain steady rhythm.' },
            { name: 'Belly Breathing', description: 'Focus on expanding belly during inhale, contracting during exhale.' },
            { name: '4-4-4-4 Breathing', description: 'Inhale 4, hold 4, exhale 4, hold 4. Good for focus.' },
            { name: 'Lion\'s Breath', description: 'Inhale deeply, then exhale forcefully with tongue out. Repeat 3-5 times.' },
            { name: 'Humming Bee Breath', description: 'Inhale, then exhale while making humming sound. Feel vibrations.' },
            { name: 'Sitali Breath', description: 'Curl tongue, inhale through mouth, exhale through nose. Cooling effect.' },
            { name: 'Kapalabhati', description: 'Forceful exhales through nose, passive inhales. 20-30 rounds.' },
            { name: 'Ujjayi Breath', description: 'Inhale/exhale through nose with slight throat constriction. Ocean sound.' },
            { name: 'Breath Counting', description: 'Count inhales and exhales up to 10, then start over.' },
            { name: 'Mindful Breathing', description: 'Focus attention on natural breath flow without controlling it.' }
        ];
        
        res.render('resources-breathing', {
            title: 'Breathing Exercises',
            theme: req.session.theme || 'light',
            settings: settings || {},
            resources
        });
    } catch (err) {
        console.error('Error:', err);
        res.redirect('/resources');
    }
});

router.get('/meditation', isAuthenticated, async (req, res) => {
    try {
        const userId = new ObjectId(req.session.userId);
        const settings = await Settings.getUserSettings(userId);
        
        const resources = [
            { name: 'Mindfulness Meditation', description: 'Focus on being present in the moment, observing thoughts without judgment.' },
            { name: 'Transcendental Meditation', description: 'Use a mantra to settle the mind into a state of restful awareness.' },
            { name: 'Guided Meditation', description: 'Follow along with a teacher\'s instructions for relaxation and insight.' },
            { name: 'Loving-Kindness Meditation', description: 'Cultivate feelings of compassion and love towards yourself and others.' },
            { name: 'Body Scan Meditation', description: 'Systematically focus attention on different parts of the body.' },
            { name: 'Walking Meditation', description: 'Practice mindfulness while walking slowly and deliberately.' },
            { name: 'Zen Meditation (Zazen)', description: 'Sit quietly and observe thoughts arising and passing.' },
            { name: 'Vipassana Meditation', description: 'Develop insight into the nature of reality through observation.' },
            { name: 'Metta Meditation', description: 'Send loving thoughts to yourself, loved ones, and all beings.' },
            { name: 'Chakra Meditation', description: 'Focus on energy centers in the body for balance and healing.' },
            { name: 'Mantra Meditation', description: 'Repeat a word or phrase to focus the mind and achieve calm.' },
            { name: 'Visualization Meditation', description: 'Use imagination to create peaceful scenes or achieve goals.' },
            { name: 'Progressive Muscle Relaxation', description: 'Tense and relax different muscle groups for deep relaxation.' },
            { name: 'Sound Bath Meditation', description: 'Immerse in healing sounds and vibrations for relaxation.' },
            { name: 'Yoga Nidra', description: 'A guided relaxation technique leading to deep rest and awareness.' }
        ];
        
        res.render('resources-meditation', {
            title: 'Meditation',
            theme: req.session.theme || 'light',
            settings: settings || {},
            resources
        });
    } catch (err) {
        console.error('Error:', err);
        res.redirect('/resources');
    }
});

module.exports = router;
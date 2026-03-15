const db = require('../config/db');
const { ObjectId } = require('mongodb');

class Mood {
    static async create(userId, moodData) {
        try {
            const database = await db.connectDB();
            const { mood_score, emotions, triggers, notes, entry_date } = moodData;
            
            const result = await database.collection('mood_entries').insertOne({
                user_id: userId,
                mood_score,
                emotions: emotions || null,
                triggers: triggers || null,
                notes: notes || null,
                entry_date: entry_date || new Date()
            });
            
            return { _id: result.insertedId, user_id: userId, mood_score, emotions, triggers, notes, entry_date: entry_date || new Date() };
        } catch (err) {
            console.error('Error creating mood:', err);
            throw err;
        }
    }
    
    static async getAllByUser(userId) {
        try {
            const database = await db.connectDB();
            const moods = await database.collection('mood_entries')
                .find({ user_id: userId })
                .sort({ entry_date: -1 })
                .limit(30)
                .toArray();
            
            return moods;
        } catch (err) {
            console.error('Error getting moods:', err);
            throw err;
        }
    }
}

module.exports = Mood;
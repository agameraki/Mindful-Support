const db = require('../config/db');
const { ObjectId } = require('mongodb');

class Journal {
    static async create(userId, journalData) {
        try {
            const database = await db.connectDB();
            const { title, content, mood_score, tags } = journalData;
            
            const result = await database.collection('journal_posts').insertOne({
                user_id: userId,
                title,
                content,
                mood_score: mood_score || null,
                tags: tags || null,
                created_at: new Date()
            });
            
            return { _id: result.insertedId, user_id: userId, title, content, mood_score, tags, created_at: new Date() };
        } catch (err) {
            console.error('Error creating journal:', err);
            throw err;
        }
    }
    
    static async getAllByUser(userId) {
        try {
            const database = await db.connectDB();
            const journals = await database.collection('journal_posts')
                .find({ user_id: userId })
                .sort({ created_at: -1 })
                .toArray();
            
            return journals;
        } catch (err) {
            console.error('Error getting journals:', err);
            throw err;
        }
    }
    
    static async getById(id, userId) {
        try {
            const database = await db.connectDB();
            const journal = await database.collection('journal_posts').findOne({
                _id: new ObjectId(id),
                user_id: userId
            });
            
            return journal;
        } catch (err) {
            console.error('Error getting journal:', err);
            throw err;
        }
    }
}

module.exports = Journal;
const db = require('../config/db');
const { ObjectId } = require('mongodb');

class Settings {
    static async getUserSettings(userId) {
        try {
            const database = await db.connectDB();
            const settings = await database.collection('user_settings').findOne({ user_id: userId });
            return settings;
        } catch (err) {
            console.error('Error getting settings:', err);
            throw err;
        }
    }
    
    static async updateTheme(userId, theme) {
        try {
            const database = await db.connectDB();
            await database.collection('user_settings').updateOne(
                { user_id: userId },
                { $set: { theme } },
                { upsert: true }
            );
            
            return true;
        } catch (err) {
            console.error('Error updating theme:', err);
            throw err;
        }
    }
}

module.exports = Settings;
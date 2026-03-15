const db = require('../config/db');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');

class User {
    static async create(email, username, password) {
        try {
            const database = await db.connectDB();
            const hashedPassword = await bcrypt.hash(password, 10);
            
            const result = await database.collection('users').insertOne({
                email,
                username,
                password_hash: hashedPassword,
                avatar: null,
                created_at: new Date()
            });
            
            console.log('User created:', { id: result.insertedId, email, username });
            
            const userId = result.insertedId;
            
            await database.collection('user_settings').insertOne({ user_id: userId });
            await database.collection('user_streaks').insertOne({ user_id: userId });
            
            return { id: userId, email, username };
        } catch (err) {
            console.error('FULL ERROR:', err);
            throw err;
        }
    }
    
    static async findByEmail(email) {
        try {
            const database = await db.connectDB();
            const user = await database.collection('users').findOne({ email });
            return user;
        } catch (err) {
            console.error('Error finding user:', err);
            throw err;
        }
    }
    
    static async findById(id) {
        try {
            const database = await db.connectDB();
            const objectId = id && id._bsontype === 'ObjectID' ? id : new ObjectId(id);
            const user = await database.collection('users').findOne({ _id: objectId });
            if (!user) return null;
            // Normalize return value to include `id` for compatibility
            user.id = user._id.toString();
            return user;
        } catch (err) {
            console.error('Error finding user:', err);
            throw err;
        }
    }
    
    static async verifyPassword(plainPassword, hashedPassword) {
        try {
            return await bcrypt.compare(plainPassword, hashedPassword);
        } catch (err) {
            return false;
        }
    }
    
    static async update(userId, updates) {
        try {
            const database = await db.connectDB();
            const { username, email } = updates;
            
            await database.collection('users').updateOne(
                { _id: userId },
                { $set: { username, email } }
            );
            
            return true;
        } catch (err) {
            console.error('Error updating user:', err);
            throw err;
        }
    }
    
    static async updatePassword(userId, newPassword) {
        try {
            const database = await db.connectDB();
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            
            await database.collection('users').updateOne(
                { _id: userId },
                { $set: { password_hash: hashedPassword } }
            );
            
            return true;
        } catch (err) {
            console.error('Error updating password:', err);
            throw err;
        }
    }
    
    static async updateAvatar(userId, avatar) {
        try {
            const database = await db.connectDB();
            
            await database.collection('users').updateOne(
                { _id: userId },
                { $set: { avatar } }
            );
            
            return true;
        } catch (err) {
            console.error('Error updating avatar:', err);
            throw err;
        }
    }
}

module.exports = User;
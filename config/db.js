const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mindful_support';
const client = new MongoClient(uri);

let db = null;

async function connectDB() {
    try {
        if (db) {
            return db;
        }
        await client.connect();
        db = client.db('mindful_support');
        console.log('✅ Connected to MongoDB');
        return db;
    } catch (err) {
        console.error('❌ MongoDB connection failed:', err.message);
        throw err;
    }
}

module.exports = {
    connectDB,
    client
};







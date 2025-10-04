const { MongoClient } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.MONGO_URI);

async function connectDB() {
    try {
        if (!client.topology || !client.topology.isConnected()) {
            await client.connect();
            console.log('MongoDB Connected');
        }
        return client.db('wheelpact-db'); // make sure this matches your DB name
    } catch (err) {
        console.error('MongoDB Connection Error:', err);
        throw err;
    }
}

module.exports = { client, connectDB };
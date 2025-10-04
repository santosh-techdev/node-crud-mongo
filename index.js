const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

app.get('/api/users', async (req, res) => {
    try {
        await client.connect();
        const db = client.db('wheelpact_demo'); // Your database name
        const users = await db.collection('users').find().toArray();
        res.json(users);
    } catch (err) {
        console.error('MongoDB fetch error:', err);
        res.status(500).json({ error: 'Failed to fetch users' });
    } finally {
        await client.close(); // Optional: close after each request
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
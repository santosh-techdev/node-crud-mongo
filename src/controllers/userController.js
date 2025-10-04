const { connectDB } = require('../config/db');

exports.getUsers = async (req, res) => {
    try {
        const db = await connectDB();
        const users = await db.collection('users').find().toArray();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch users', error: err.message });
    }
};

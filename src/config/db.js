// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    if (mongoose.connection.readyState === 1) return; // Already connected

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;

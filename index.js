const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wheelpact-db';

(async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected successfully!');
        console.log('Connected to DB:', mongoose.connection.name);

        await mongoose.connection.close();
        console.log('🔌 Connection closed.');
    } catch (error) {
        console.error('MongoDB connection failed!');
        console.error(error.message);
    }
})();

const mongoose = require('mongoose');

const usersCredentialsSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    user_id: { type: Number, required: true },
    password: { type: String, required: true },
    is_active: { type: Number, default: 1 },
    created_at: { type: Date, default: Date.now }
});

// Explicitly set the collection name to `userscredentials`
module.exports = mongoose.model('UsersCredential', usersCredentialsSchema, 'userscredentials');

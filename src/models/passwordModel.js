const mongoose = require('mongoose');

const passwordSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    password: { type: String, required: true },
    is_active: { type: Number, default: 1 },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Password', passwordSchema);

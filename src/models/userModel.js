const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    user_code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true
    },
    contact_no: {
        type: Number,
        unique: true,
        required: true
    },
    gender: { type: Number, enum: [0, 1], default: 0 },
    country_id: { type: Number, default: 0 },
    state_id: { type: Number, default: 0 },
    city_id: { type: Number, default: 0 },
    zipcode: { type: Number, default: 0 },
    role_id: { type: Number, default: 2 },
    otp: { type: Number },
    otp_status: { type: Number, default: 0 },
    is_active: { type: Number, default: 1 },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
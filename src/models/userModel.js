const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    gender: { type: Number, enum: [0, 1], default: 0 },
    country_id: { type: Number, default: 0 },
    state_id: { type: Number, default: 0 },
    city_id: { type: Number, default: 0 },
    zipcode: { type: Number, default: 0 },
    contact_no: { type: Number, required: true },
    role_id: { type: Number, default: 2 },
    otp: { type: Number },
    otp_status: { type: Number, default: 0 },
    is_active: { type: Number, default: 1 },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);

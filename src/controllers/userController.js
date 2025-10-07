const User = require('../models/userModel');
const Password = require('../models/passwordModel');
const bcrypt = require('bcrypt');

// Helper to generate next user code (e.g., USR00023)
async function generateUserCode() {
    const lastUser = await User.findOne().sort({ _id: -1 });
    const lastId = lastUser ? parseInt(lastUser.user_code.replace('USR', '')) : 0;
    const nextId = lastId + 1;
    return `USR${String(nextId).padStart(5, '0')}`;
}

// CREATE User
exports.createUser = async (req, res) => {
    try {
        const { name, email, gender, contact_no, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, Email, and Password are required' });
        }

        const user_code = await generateUserCode();

        const newUser = new User({
            user_code,
            name,
            email,
            gender,
            contact_no,
            otp: Math.floor(100000 + Math.random() * 900000), // random 6-digit OTP
            otp_status: 1,
            is_active: 1
        });

        const savedUser = await newUser.save();

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        const userPassword = new Password({
            user_id: savedUser._id,
            password: hashedPassword
        });
        await userPassword.save();

        res.status(201).json({ message: 'User created successfully', user: savedUser });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ message: 'Failed to create user', error: err.message });
    }
};

// READ all users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch users', error: err.message });
    }
};

// READ single user
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch user', error: err.message });
    }
};

// UPDATE user
exports.updateUser = async (req, res) => {
    try {
        const updated = await User.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updated_at: new Date() },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User updated successfully', user: updated });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update user', error: err.message });
    }
};

// DELETE user
exports.deleteUser = async (req, res) => {
    try {
        const deleted = await User.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'User not found' });

        await Password.deleteMany({ user_id: req.params.id });
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete user', error: err.message });
    }
};

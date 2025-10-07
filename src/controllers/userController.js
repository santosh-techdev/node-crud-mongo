
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const UsersCredential = require('../models/usersCredential');
const sendEmail = require('../services/emailService');
const OTPService = require('../services/otpService');

// Helper to generate next user code (e.g., USR00023)
async function generateUserCode() {
    const lastUser = await User.findOne().sort({ _id: -1 });
    const lastId = lastUser ? parseInt(lastUser.user_code.replace('USR', '')) : 0;
    const nextId = lastId + 1;
    return nextId;
}
// Create User
exports.createUser = async (req, res) => {
    const session = await mongoose.startSession(); // Start session
    session.startTransaction(); // Begin transaction

    try {
        const { name, email, contact_no, password, confirm_password } = req.body;

        // Step 1: Validate required fields
        if (!name)
            return res.status(409).json({ responseCode: 409, responseMessage: 'Required Name.' });
        if (!email)
            return res.status(409).json({ responseCode: 409, responseMessage: 'Required Email.' });
        if (!contact_no)
            return res.status(409).json({ responseCode: 409, responseMessage: 'Required Contact Number.' });
        if (!password || !confirm_password)
            return res.status(409).json({ responseCode: 409, responseMessage: 'Password fields are required.' });
        if (password !== confirm_password)
            return res.status(409).json({ responseCode: 409, responseMessage: 'Passwords do not match.' });

        // Step 2: Check for duplicate user (email/contact)
        const existingUser = await User.findOne({
            is_active: 1,
            $or: [
                { email: email },
                { contact_no: contact_no }
            ]
        });

        if (existingUser) {
            let msg;
            if (existingUser.email === email && existingUser.contact_no === contact_no)
                msg = 'User already exists.';
            else if (existingUser.email === email)
                msg = 'Email already registered.';
            else msg = 'Contact number already registered.';

            return res.status(409).json({ responseCode: 409, responseMessage: msg });
        }

        // Step 3: Generate OTP and user code
        const otp = OTPService.generateOTP();
        const lastUser = await User.findOne().sort({ _id: -1 });
        const next_id = lastUser ? lastUser.id + 1 : 1;

        // Step 4: Create user
        const user = await User.create([{
            id: next_id,
            user_code: `USR${String(next_id).padStart(5, '0')}`,
            name,
            email,
            contact_no: parseInt(contact_no, 10),
            role_id: 2,
            otp: parseInt(otp, 10),
            otp_status: 1,
            is_active: 2,
            created_at: new Date()
        }], { session });

        // Step 5: Hash and save credentials
        const hashedPassword = await bcrypt.hash(password, 10);
        await UsersCredential.create([{
            id: next_id,
            user_id: next_id,
            password: hashedPassword,
            is_active: 1,
            created_at: new Date()
        }], { session });

        // Step 6: (Optional) Send verification email
        // const subject = 'Partner Registration OTP Verification';
        // const body = `<p>Dear ${name},</p>
        // <p>Your OTP for registration is: <b>${otp}</b></p>`;
        // const mailSent = await sendEmail(email, name, subject, body);
        // if (!mailSent) throw new Error('Email sending failed');

        // ✅ Commit the transaction
        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            responseCode: 200,
            responseMessage: 'User created successfully. Verification OTP sent to email.',
            partnerId: user[0]._id
        });

    } catch (error) {
        // ❌ Rollback on any error
        await session.abortTransaction();
        session.endSession();

        console.error('Error in createUser (rolled back):', error);
        res.status(500).json({
            responseCode: 500,
            responseMessage: 'An unexpected error occurred. Transaction rolled back.',
            error: error.message
        });
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

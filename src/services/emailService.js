const nodemailer = require('nodemailer');

module.exports = async (to, name, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: `"Your App" <${process.env.MAIL_USER}>`,
            to,
            subject,
            html,
        });

        return true;
    } catch (error) {
        console.error('Email send error:', error);
        return false;
    }
};

const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const User = require('./userModel');
const SibApiV3Sdk = require("sib-api-v3-sdk");
const jwt = require("jsonwebtoken");

const homePage = async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'public', 'signup.html'));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'home page error' });
    }
};

const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        const savedUser = await newUser.save();
        res.status(201).json({ message: "user created" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "server error" });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "all fields are required" });
        }
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "user not found" });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: "invalid password" });
        }
        res.status(200).json({ message: "login successful" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // generate reset token
        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        // brevo setup
        let defaultClient = SibApiV3Sdk.ApiClient.instance;
        let apiKey = defaultClient.authentications["api-key"];
        apiKey.apiKey = process.env.BREVO_API_KEY;
        let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
        let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.subject = "Password Reset Request";
        sendSmtpEmail.sender = {
            name: "App Name",
            email: process.env.BREVO_FROM_EMAIL,
        };
        sendSmtpEmail.to = [{ email }];
        sendSmtpEmail.htmlContent = `
      <p>Hello,</p>
      <p>You requested a password reset. Click below:</p>
      <a href="${resetLink}">Reset Password</a>
    `;
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        return res.status(200).json({
            message: "Password reset email sent successfully",
        });
    } catch (err) {
        console.error("forgot Password Error:", err);
        return res.status(500).json({ message: "error sending email" });
    }
};

const resetPasswordPage = async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, "public", "resetPassword.html"));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'reset password page error' });
    }
};

module.exports = { homePage, signup, login, forgotPassword, resetPasswordPage };
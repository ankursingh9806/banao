const path = require('path');
const bcrypt = require('bcrypt');
const User = require('./userModel');

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

module.exports = { homePage, signup, login };
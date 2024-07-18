var express = require("express");

const User = require("../Models/user.model");
var authRouter = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "";

// Đăng nhập
authRouter.post("/login", async function (req, res) {
    const { email, password } = req.body;
    console.log(req.body);
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invali password" });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
            expiresIn: "1h",
        });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Đăng ký
authRouter.post("/register", async function (req, res) {
    const { email, password, name } = req.body;
    console.log(req.body);
    try {
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email: email,
            password: hashedPassword,
            name,
        });
        await newUser.save();

        const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
            expiresIn: "1h",
        });
        res.status(201).json({ token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
});

module.exports = authRouter;

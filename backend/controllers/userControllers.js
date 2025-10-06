const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");

// Generate JWT
const generateToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, {
        expiresIn: "3d",
    });
};


const signupUser = async (req, res) => {
    const {
        email,
        password,
    } = req.body;




    try {
        if (
            !email ||
            !password
        ) {
            res.status(400);
            throw new Error("Please add all fields");
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400);
            throw new Error("User already exists");
        }
        
        if (!validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })) {
            res.status(400);
            throw new Error("Password is too weak. Must contain at least 8 characters, including uppercase, lowercase, number, and special symbol.");
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            email,
            password: hashedPassword
        });

        if (user) {
            // console.log(user._id);
            const token = generateToken(user._id);
            res.status(201).json({ email, token });
        } else {
            res.status(400);
            throw new Error("Invalid user data");
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check for user email
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = generateToken(user._id);
            res.status(200).json({ email, token });
        } else {
            res.status(400);
            throw new Error("Invalid credentials");
        }

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const getMe = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    signupUser,
    loginUser,
    getMe,
};

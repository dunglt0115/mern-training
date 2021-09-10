/* eslint-disable import/extensions */
import express from 'express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';

const router = express.Router();

/**
 * @route POST api/auth/register
 * @desc Register user
 * @access Public
 */
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Invalid username or password'
        });
    }

    try {
        const user = await UserModel.findOne({ username });

        if (user) {
            return res.status(400).json({
                success: false,
                message: 'This username has already been registered!'
            });
        }

        const hashedPassword = await argon2.hash(password);
        const newUser = new UserModel({ username, password: hashedPassword });
        await newUser.save();

        const accessToken = jwt.sign({ userId: newUser._id }, process.env.TOKEN_SECRET);

        return res.json({
            success: true,
            message: 'Registered successfully!',
            accessToken
        });
    } catch (error) {
        // Error in here is server error
        return res.status(500).json({
            message: error.message,
            stack: error.stack
        });
    }
});

/**
 * @route POST api/auth/login
 * @desc Login user
 * @access Public
 */
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Invalid username or password'
        });
    }

    try {
        const user = await UserModel.findOne({ username });

        if (!user) {
            return res.status(400).json({
                success: false,
                // To enhance security, don't let users know where they entered wrong
                message: 'Invalid username or password'
            });
        }

        const passwordValid = await argon2.verify(user.password, password);

        if (!passwordValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid username or password'
            });
        }

        const accessToken = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET);

        return res.json({
            success: true,
            message: 'Logged in successfully!',
            accessToken
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            stack: error.stack
        });
    }
});

export default router;

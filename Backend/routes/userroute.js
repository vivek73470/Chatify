const express = require('express');
const User = require('../model/UserRegisterModel/usermodel')
const authenticate = require('../middleware/middleware')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userRouter = express.Router();

userRouter.post('/register', async (req, res) => {
    const { name, number, password, profilepic, lastSeen, status } = req.body
    try {
        const exitingUser = await User.findOne({ number });
        if (exitingUser) {
            return res.status(409).json({ status: false, message: 'Number is already registered' })
        }
        const saltRounds = 10;
        const securePassword = await bcrypt.hash(password, saltRounds)
        const newUser = new User({ name, number, password: securePassword, profilepic, lastSeen, status })
        await newUser.save();
        return res.status(201).json({ status: true, message: 'Registered successfully' })
    } catch (e) {
        console.error('Error during user registration:', e);
        return res.status(500).json({
            status: false,
            message: 'Something went wrong, please try again later.'
        });
    }
})

// Login
userRouter.post('/login', async (req, res) => {
    const { number, password } = req.body
    try {
        const user = await User.findOne({ number })
        if (!user) {
            return res.status(404).json({ status: false, message: 'Phone Number not found' })
        }

        const result = await bcrypt.compare(password, user.password);

        if (result) {
            const token = jwt.sign({ userId: user._id }, 'chatify')
            return res.status(200).json({
                status: true,
                message: "Login successfully",
                _id: user._id,
                token: token
            });
        } else {
            return res.status(401).json({ message: "Wrong credentials" });
        }
    } catch (e) {
        return res.status(500).json({ message: 'internal server error' })
    }
})

//logout
userRouter.post('/logout', authenticate, async (req, res) => {
    try {
        req.User.token = null;
        await req.User.save();
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Logout failed" });
    }
})
// Verify Number & Generate Reset Code
userRouter.post('/verifyNumber', async (req, res) => {
    const { number } = req.body;
    try {
        const numberExist = await User.findOne({ number })
        console.log(numberExist, 'nm')
        if (!numberExist) {
            return res.status(404).json({ status: false, message: 'Phone Number not found' })
        }
        const reserCode = Math.floor(100000 + Math.random() * 900000).toString();
        return res.status(200).json({
            status: true,
            message: 'Verification code sent',
            _id: numberExist?._id,
            number: numberExist?.number,
            code: reserCode
        })

    } catch (e) {
        return res.status(500).json({ status: false, message: 'Server error' });

    }
})

// new password
userRouter.put('/resetPassword/:id', async (req, res) => {
    const { password } = req.body;
    const id = req.params.id;
    try {
        const saltRounds = 10;
        const securePassword = await bcrypt.hash(password, saltRounds)
        const user = await User.findByIdAndUpdate({ _id: id, password: securePassword }, { new: true })
        if (!user) {
            return res.status(404).json({ status: false, message: "User not found." });
        }
        return res.status(200).json({ status: true, message: "Password changed successfully." });
    } catch (e) {
        return res.status(500).json({ status: false, message: 'Server error' });

    }
})

module.exports = userRouter;
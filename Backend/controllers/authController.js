const authService = require('../services/authService')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Register
const register = async (req, res) => {
    const { name, number, password, profilepic, lastSeen, status } = req.body
    try {
        const exitingUser = await authService.findUserByPhone(number);
        if (exitingUser) {
            return res.status(409).json({
                status: false,
                message: 'Number is already registered'
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await authService.createUser({name,number,password: hashedPassword,profilepic,lastSeen,status,});
        return res.status(201).json({
            status: true,
            message: 'Registered successfully',
        });
    } catch (e) {
        console.error('Error during user registration:', e);
        return res.status(500).json({
            status: false,
            message: 'Something went wrong, please try again later.'
        });
    }
}

//Login
const login = async (req, res) => {
    const { number, password } = req.body;

    try {
        const user = await authService.findUserByPhone(number);
        if (!user) {
            return res.status(404).json({
                status: false,
                message: 'Phone Number not found',
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                status: false,
                message: 'Wrong credentials',
            });
        }

        const token = jwt.sign({ userId: user._id }, 'chatify', {
            expiresIn: '7d',
        });

        return res.status(200).json({
            status: true,
            message: 'Login successfully',
            data: user,
            token,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Internal server error',
        });
    }
};

// Verify Number
const verifyNumber = async (req, res) => {
    const { number } = req.body;

    try {
        const user = await authService.findUserByPhone(number);
        if (!user) {
            return res.status(404).json({
                status: false,
                message: 'Phone Number not found',
            });
        }

        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

        return res.status(200).json({
            status: true,
            message: 'Verification code sent',
            _id: user._id,
            number: user.number,
            code: resetCode,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Server error',
        });
    }
};

// Reset Password
const resetPassword = async (req, res) => {
    const { password } = req.body;
    const { id } = req.params;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await authService.updateUserPassword(id, hashedPassword);
        if (!user) {
            return res.status(404).json({
                status: false,
                message: 'User not found',
            });
        }

        return res.status(200).json({
            status: true,
            message: 'Password changed successfully',
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Server error',
        });
    }
};

// Search user
const searchUser = async (req, res) => {
    const { number } = req.query;

    if (!number) {
        return res.status(400).json({
            status: false,
            message: 'Number is required',
        });
    }

    try {
        const user = await authService.findUserByPhone(number);
        if (!user) {
            return res.status(404).json({
                status: false,
                message: 'User not found',
            });
        }

        const { password, ...safeUser } = user.toObject();

        return res.status(200).json({
            status: true,
            user: safeUser,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Server error',
        });
    }
};

module.exports = {
    register,
    login,
    verifyNumber,
    resetPassword,
    searchUser,
};
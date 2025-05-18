const express = require('express');
const User = require('../model/UserRegisterModel/usermodel')
const bcrypt = require('bcrypt')

const userRouter = express.Router();

userRouter.post('/register', async (req, res) => {
    const { name, number, password, profilepic, lastSeen, status } = req.body
    const exitingUser = await User.findOne({number});
    if(exitingUser){
        return res.status(StatusCodes.CONFLICT).json({status: false, message: 'Number is already registered'})
    }
    const saltRounds = 10;
    const securePassword = await bcrypt.hash(password,saltRounds)
    const newUser = new User({ name, number, password:securePassword, profilepic, lastSeen, status })
    await newUser.save();
    return res.status(201).json({ status: true, message: 'User registered successfully' })
})

module.exports = userRouter;
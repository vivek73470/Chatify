const express = require('express');
const authController = require('../controllers/authController')
const authRouter = express.Router();

authRouter.post('/register',authController.register)
authRouter.post('/login',authController.login)
authRouter.post('/verifyNumber',authController.verifyNumber)
authRouter.put('/resetPassword/:id',authController.resetPassword)
authRouter.post('/search',authController.searchUser)
// authRouter.post('/logout',authController.register)

module.exports = authRouter;
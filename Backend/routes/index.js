const express = require('express');
const authRouter = require('./authRoutes');
const allUsersRoutes = require('./allUsersRoutes');
const messageRoutes = require('./messageRoute');
const router = express.Router();

// Mount all routes
router.use('/', authRouter);
router.use('/users', allUsersRoutes);
router.use('/message', messageRoutes);

module.exports = router;
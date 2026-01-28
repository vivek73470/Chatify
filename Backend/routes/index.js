const express = require('express');
const authRouter = require('./authRoutes');
const allUsersRoutes = require('./allUsersRoutes');
const router = express.Router();

// Mount all routes
router.use('/', authRouter);
router.use('/users', allUsersRoutes);

module.exports = router;
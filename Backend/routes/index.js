const express = require('express');
const authRouter = require('./authRoutes');
const router = express.Router();

// Mount all routes
router.use('/', authRouter);

module.exports = router;
const express = require('express')
const {getAllUsers} = require('../controllers/allUserController');
const authenticate = require('../middleware/middleware');

const allUsersRoutes = express.Router();

allUsersRoutes.get('/getAllUsers',authenticate,getAllUsers);

module.exports = allUsersRoutes;
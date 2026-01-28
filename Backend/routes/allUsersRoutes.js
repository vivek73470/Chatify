const express = require('express')
const {getAllUsers} = require('../controllers/allUserController')

const allUsersRoutes = express.Router();

allUsersRoutes.get('/getAllUsers',getAllUsers);

module.exports = allUsersRoutes;
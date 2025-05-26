const jwt = require('jsonwebtoken')
const User = require('../model/UserRegisterModel/usermodel')

const authenticate = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).send("Authentication token is required");
    }

    try {
        const decoded = jwt.verify(token, 'chatify');
        if (decoded) {
            return next();
        } else {
            return res.status(401).send("Invalid Token");
        }
    } catch (err) {
        return res.status(500).send("Token verification failed");
    }
};

module.exports = authenticate;

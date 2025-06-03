const jwt = require("jsonwebtoken");
const { accessTokenSecret } = require('../config/auth');
const { err } = require('../utils/responses');

const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json(err('', 'Authentication required.'));
    }
    
    jwt.verify(token, accessTokenSecret, (error, decoded) => {
        if (error) {
            // Check if the error is because the token is expired
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json(err('', 'Token has expired.'));
            }
            // All other JWT errors (invalid signature, malformed token, etc.)
            return res.status(403).json(err('', 'Invalid token.'));
        }

        req.user = decoded;
        next();
    });
};

module.exports = auth;
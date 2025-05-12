const jwt = require("jsonwebtoken");
const { accessTokenSecret } = require('../config/auth')
const { err } = require('../utils/responses');
const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json(err('', 'Authentication required.'));
        return;
    }
    jwt.verify(token, accessTokenSecret, (err, decoded) => {
        if (err) {
            res.status(403).json(err('', 'Invalid token.'));
            return;
        }

        req.user = decoded;
        next();
    });
};

module.exports = auth;

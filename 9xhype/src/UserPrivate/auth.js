const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).send('Access Denied');
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};

const adminOnly = (req, res, next) => {
    if (!req.user.isAdmin) {
        return res.status(403).send('Forbidden');
    }
    next();
};

module.exports = { authenticateJWT, adminOnly };

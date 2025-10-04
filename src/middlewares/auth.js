const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const header = req.headers['authorization'];
    const token = header && header.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Access Denied' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid Token' });
        req.user = decoded;
        next();
    });
}

module.exports = verifyToken;

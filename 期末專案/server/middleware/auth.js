const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        // console.log('Auth Middleware - Headers:', req.headers); // Too noisy

        if (!token) {
            console.log('Auth Middleware - No Token Provided');
            throw new Error('No token');
        }

        // console.log('Auth Middleware - Token received:', token.substring(0, 10) + '...');

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mysecretkey123');
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Auth Middleware - Error:', error.message);
        res.status(401).json({ success: false, message: '請先登入或重新驗證身分 (Please authenticate)' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Admin access required.' });
    }
};

module.exports = { auth, admin };

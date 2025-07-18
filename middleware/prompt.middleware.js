import jwt from 'jsonwebtoken';
import config from '../config.js'; 

function userMiddleware(req, res, next) {
    const authHead = req.headers.authorization;


    if (!authHead || !authHead.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHead.split(' ')[1]; // ✅ Corrected this
 

    try {
        const decoded = jwt.verify(token, config.JWT_USER_PASSWORD);

        req.userId = decoded.id || decoded.userId || decoded._id;
        if (!req.userId) {
            return res.status(400).json({ error: 'User ID not found in token payload' });
        }

        next();
    } catch (error) {
        console.error('JWT verification failed:', error);
        return res.status(401).json({ error: 'Invalid token or expired!' });
    }
}

export default userMiddleware;

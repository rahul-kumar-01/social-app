import jwt from 'jsonwebtoken';
import User from '../models/user-schema.js';

export const verfiyToken = async (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(verified.id);
        req.user = user;
        next();
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: 'Invalid token' });
    }
}
import jwt from 'jsonwebtoken';

export const verifyJwtToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        // Status 401: Unauthorized
        return res.status(401).json({
            success: false,
            message: 'Access token not found'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

        req.userId = decoded.userId;

        return next();
    } catch (error) {
        // Status 401: Forbidden
        return res.status(403).json({
            success: false,
            message: 'Access token invalid'
        });
    }
};

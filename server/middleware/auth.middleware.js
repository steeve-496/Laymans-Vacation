const jwt = require('jsonwebtoken');
const prisma = require('../prismaClient');

const protect = async (req, res, next) => {
    let token;

    // Check for token in cookies (preferred) or Authorization header
    if (req.cookies.token) {
        token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        console.log("No token found in request");
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach admin to request
        req.admin = await prisma.admin.findUnique({
            where: { id: decoded.id },
            select: { id: true, username: true, role: true } // Exclude password
        });

        if (!req.admin) {
            return res.status(401).json({ message: 'Not authorized, admin not found' });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

module.exports = { protect };

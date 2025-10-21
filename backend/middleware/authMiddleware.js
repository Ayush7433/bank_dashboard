const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if(!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    //Expect header : "Bearer <token>"
    const parts = authHeader.split(' ');
    if(parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ message: 'Invalid authorization header format' });
    }

    const token = parts[1];
    try{
        const payload = jwt.verify(token, JWT_SECRET);
        //attach user info to request
        req.user = payload;
        next();
    }catch(err){
        console.error("JWT verification error:", err);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

module.exports = authMiddleware;
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized - no token provided" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });
        }

        if (decoded.exp <= Date.now() / 1000) {
            return res.status(401).json({ success: false, message: "Unauthorized - token expired" });
        }

        console.log("decoded", decoded);
        req.userId = decoded.userId;
        req.role = decoded.role;
        next();
    } catch (error) {
        console.log("Error in verifyToken ", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = {
    verifyToken,
};
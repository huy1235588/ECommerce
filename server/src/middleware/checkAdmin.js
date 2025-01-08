
const checkAdmin = (req, res, next) => {
    if (req.role !== "admin") {
        return res.status(403).json({ success: false, message: "Admin resource! Access denied" });
    }
    next();
}

module.exports = {
    checkAdmin,
};
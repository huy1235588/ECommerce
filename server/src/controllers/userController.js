const User = require("../models/userModel");

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            ...users,
            password: null,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUsersByPage = async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Mặc định trang 1
    const limit = parseInt(req.query.limit) || 10; // Mặc định 10 item mỗi trang
    const skip = (page - 1) * limit; // Bỏ qua (page - 1) * limit item

    try {
        const users = await User.find().skip(skip).limit(limit);
        res.status(200).json({
            ...users,
            password: null,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllUsers,
    getUsersByPage,
};
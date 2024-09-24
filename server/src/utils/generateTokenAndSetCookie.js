const jwt = require('jsonwebtoken')

const generateTokenAndSetCookie = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    res.cookie("token", token, {
        httpOnly: true, // Cookie chỉ được truy cập bởi http
        secure: process.env.NODE_ENV === "production", // Chỉ gửi cookie qua HTTPS nếu môi trường là production
        sameSite: "strict", // Cookie chỉ gửi cùng các yêu cầu xuất phát từ cùng một site.
        maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie sẽ tồn tại trong 7 ngày
    });

    return token;
};

module.exports = generateTokenAndSetCookie;
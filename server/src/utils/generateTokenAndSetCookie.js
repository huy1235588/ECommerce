const jwt = require('jsonwebtoken');

// Hàm tạo JWT token và thiết lập cookie
const generateTokenAndSetCookie = (res, payload, options = {}) => {
    // Lấy các giá trị từ options hoặc sử dụng giá trị mặc định
    const {
        secret = process.env.JWT_SECRET, // Khóa bí mật dùng để ký JWT
        expiresIn = "7d", // Thời gian hết hạn của JWT (mặc định là 7 ngày)
        cookieName = "token", // Tên cookie (mặc định là "token")
        cookieDomain = process.env.CLIENT_DOMAIN, // Domain mà cookie áp dụng
        cookieSecure = process.env.NODE_ENV === "production", // Chỉ gửi cookie qua HTTPS nếu môi trường là production
        cookieSameSite = "strict", // Cài đặt SameSite cho cookie (bảo vệ chống CSRF)
        cookieHttpOnly = true, // Cookie chỉ truy cập được qua HTTP, không thể truy cập từ JavaScript
        cookieMaxAge = 7 * 24 * 60 * 60 * 1000, // Thời gian tồn tại của cookie (7 ngày)
    } = options;

    // Tạo token JWT với payload và các thiết lập
    const token = jwt.sign(payload, secret, { expiresIn });

    // Thiết lập cookie trong response
    res.cookie(cookieName, token, {
        domain: cookieDomain, // Gán domain cho cookie
        httpOnly: cookieHttpOnly, // Cookie chỉ truy cập qua HTTP
        secure: cookieSecure, // Chỉ gửi cookie qua HTTPS nếu môi trường là production
        sameSite: cookieSameSite, // Bảo vệ chống lại các tấn công CSRF
        maxAge: cookieMaxAge, // Thời gian tồn tại của cookie
    });

    // Trả về token đã tạo (nếu cần sử dụng lại)
    return token;
};

module.exports = generateTokenAndSetCookie;

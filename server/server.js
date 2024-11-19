const express = require('express');
const connectDB = require('./src/config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotnet = require('dotenv');
const authRoute = require('./src/routers/authRoute');

dotnet.config();

const app = express();

// Kết nối đến MongoDB
connectDB();

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Pragma
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = process.env.ALLOW_ORIGINS; // Chỉ cho phép ở cổng 3000
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, origin); // Allow the request
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'DELETE', 'PUT'], // Chỉ cho phép các phương thức HTTP này
    allowedHeaders: [
        'Content-Type', // Cho biết định dạng của dữ liệu đang được gửi hoặc nhận
        'Authorization', // Gửi thông tin xác thực
        'Cache-Control', // Điều khiển cách thức cache (lưu trữ tạm thời)
        'Expires', // xác định thời gian mà tài nguyên sẽ hết hạn.
        'Pragma'
    ],
    credentials: true, // Cho phép gửi thông tin xác thực như cookie, token... 
}))

app.use(cookieParser()); // Phân tích các cookie trong yêu cầu HTTP (req.cookies)
app.use(express.json()); // Phân tích dữ liệu JSON trong body của yêu cầu HTTP (req.body)

app.use('/api/auth', authRoute);

const PORT = process.env.PORT || 3002; // Cổng

app.listen(PORT, () => {
    console.log(`Server is running on localhost:${PORT}`);
});
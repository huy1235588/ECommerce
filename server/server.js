const express = require('express');
const connectDB = require('./src/config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotnet = require('dotenv');
const authRoute = require('./src/routers/authRoute');
const userRoute = require('./src/routers/userRoute');
const productRouter = require('./src/routers/productRoute');
const crawlRouter = require('./src/routers/crawlRoute');
const resolvers = require('./src/graphql/resolvers');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const typeDefs = require('./src/graphql/schema');

// Đọc các biến môi trường từ file .env
dotnet.config();

// Khởi tạo ứng dụng Express
const app = express();

// Kết nối đến MongoDB
connectDB();

const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = process.env.ALLOW_ORIGINS;
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, origin);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Cache-Control', // Điều khiển cách thức cache (lưu trữ tạm thời)
        'Expires', // xác định thời gian mà tài nguyên sẽ hết hạn.
        'Pragma'
    ],
    credentials: true,
};

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Pragma
app.use(cors(corsOptions)); // Cấu hình CORS

app.use(cookieParser()); // Phân tích các cookie trong yêu cầu HTTP (req.cookies)
app.use(express.json()); // Phân tích dữ liệu JSON trong body của yêu cầu HTTP (req.body)

app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/product', productRouter);
app.use('/api/crawl', crawlRouter);

// Cấu hình cho GraphQL
const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
});

// Khởi động server
(async () => {
    await server.start();

    // Kết nối Apollo Server với Express
    app.use('/graphql', expressMiddleware(server));

    const PORT = process.env.PORT || 3001; // Cổng

    // Khởi động server
    app.listen(PORT, () => {
        console.log(`Server is running on localhost:${PORT}`);
    });
})();
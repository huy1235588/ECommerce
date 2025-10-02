# 🛍️ ECommerce Platform - HashOP

Một nền tảng thương mại điện tử hiện đại được xây dựng với Next.js và Node.js, chuyên về việc bán các sản phẩm game và phần mềm.

## 📋 Mục lục

- [Tổng quan](#-tổng-quan)
- [Tính năng](#-tính-năng)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cài đặt](#-cài-đặt)
- [Cấu hình](#-cấu-hình)
- [Sử dụng](#-sử-dụng)
- [API Documentation](#-api-documentation)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Đóng góp](#-đóng-góp)
- [Giấy phép](#-giấy-phép)

## 🎯 Tổng quan

HashOP là một nền tảng thương mại điện tử toàn diện được thiết kế đặc biệt cho việc bán các sản phẩm game và phần mềm. Platform cung cấp trải nghiệm mua sắm tuyệt vời cho người dùng và hệ thống quản lý mạnh mẽ cho admin.

## ✨ Tính năng

### 🔐 Xác thực & Phân quyền
- Đăng ký/Đăng nhập người dùng
- Xác thực email với mã OTP
- Quên mật khẩu và đặt lại mật khẩu
- Phân quyền admin/user
- JWT Authentication với cookies

### 🛒 Quản lý sản phẩm
- CRUD operations cho sản phẩm
- Upload hình ảnh và video
- Quản lý categories, genres, tags
- Hỗ trợ multiple platforms (Windows, Mac, Linux)
- System requirements management
- Screenshots và video trailers
- Pricing và discount management

### 👥 Quản lý người dùng
- Profile management
- User dashboard
- Order history
- Wishlist functionality

### 🎮 Tính năng đặc biệt cho Game
- Game achievements tracking
- Package groups và DLC management
- Detailed game information
- Video trailers và screenshots
- Platform compatibility

### 🌐 Đa ngôn ngữ & Giao diện
- Hỗ trợ tiếng Việt và tiếng Anh
- Dark/Light theme
- Responsive design
- Modern UI với Material-UI

### 📊 Admin Dashboard
- Comprehensive admin panel
- Data visualization
- Product management
- User management
- Analytics và reporting

## 🚀 Công nghệ sử dụng

### Frontend (Client)
- **Framework**: Next.js 15.1.4
- **Language**: TypeScript
- **Styling**: Material-UI (MUI) 6.1.9
- **State Management**: Redux Toolkit 2.4.0
- **HTTP Client**: Axios 1.7.8
- **Rich Text Editor**: Quill 2.0.3
- **Date Handling**: Day.js 1.11.13
- **Carousel**: Swiper 11.1.15
- **Internationalization**: i18next, react-i18next

### Backend (Server)
- **Runtime**: Node.js
- **Framework**: Express.js 4.21.2
- **Database**: MongoDB với Mongoose 8.6.1
- **GraphQL**: Apollo Server 4.11.3
- **Authentication**: JWT với bcryptjs
- **File Upload**: Multer
- **Web Scraping**: Puppeteer 23.11.1
- **Email**: Mailtrap 3.4.0
- **Validation**: Express-validator 7.2.1

### DevOps & Tools
- **Environment**: dotenv
- **CORS**: cors 2.8.5
- **Cookie Parser**: cookie-parser 1.4.6

## 📦 Cài đặt

### Yêu cầu hệ thống
- Node.js >= 18.0.0
- MongoDB >= 5.0.0
- npm hoặc yarn

### Clone repository
```bash
git clone <repository-url>
cd ECommerce
```

### Cài đặt dependencies

#### Backend
```bash
cd server
npm install
```

#### Frontend
```bash
cd client
npm install
```

## ⚙️ Cấu hình

### Backend Environment Variables
Tạo file `.env` trong thư mục `server/`:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/ecommerce

# JWT
JWT_SECRET=your_jwt_secret_key

# Email Configuration
MAILTRAP_TOKEN=your_mailtrap_token
MAILTRAP_ENDPOINT=https://send.api.mailtrap.io/

# Server Configuration
PORT=5000
NODE_ENV=development

# Client Configuration
CLIENT_DOMAIN=localhost
ALLOW_ORIGINS=http://localhost:3000

# File Upload
UPLOAD_PATH=./uploads
```

### Frontend Environment Variables
Tạo file `.env.local` trong thư mục `client/`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000

# GraphQL
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:5000/graphql
```

## 🚀 Sử dụng

### Khởi chạy Backend
```bash
cd server
npm start
```
Server sẽ chạy trên `http://localhost:5000`

### Khởi chạy Frontend
```bash
cd client
npm run dev
```
Client sẽ chạy trên `http://localhost:3000`

### Truy cập ứng dụng
- **Trang chủ**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin
- **API Endpoint**: http://localhost:5000/api
- **GraphQL Playground**: http://localhost:5000/graphql

## 📚 API Documentation

### Authentication Endpoints
```
POST /api/auth/signup          # Đăng ký tài khoản
POST /api/auth/login           # Đăng nhập
POST /api/auth/logout          # Đăng xuất
POST /api/auth/verify-email    # Xác thực email
POST /api/auth/forgot-password # Quên mật khẩu
POST /api/auth/reset-password  # Đặt lại mật khẩu
GET  /api/auth/check-auth      # Kiểm tra xác thực
```

### Product Endpoints
```
GET    /api/products           # Lấy danh sách sản phẩm
GET    /api/products/:id       # Lấy chi tiết sản phẩm
POST   /api/products           # Thêm sản phẩm mới (Admin)
PUT    /api/products/:id       # Cập nhật sản phẩm (Admin)
DELETE /api/products/:id       # Xóa sản phẩm (Admin)
POST   /api/products/upload    # Upload hình ảnh (Admin)
```

### GraphQL Schema
```graphql
type Product {
  id: ID!
  name: String!
  type: String!
  shortDescription: String!
  detailedDescription: String
  headerImage: String!
  price: PriceOverview!
  platform: Platform!
  genres: [Genre!]!
  tags: [Tag!]!
  screenshots: [Screenshot!]!
  movies: [Movie!]!
  systemRequirements: SystemRequirements
  createdAt: String!
  updatedAt: String!
}
```

## 📁 Cấu trúc dự án

```
ECommerce/
├── client/                      # Frontend (Next.js)
│   ├── public/                  # Static assets
│   │   ├── icons/              # Icon files
│   │   ├── image/              # Images
│   │   ├── locales/            # Translation files
│   │   └── logo/               # Logo assets
│   ├── src/
│   │   ├── app/                # Next.js App Router
│   │   │   ├── admin/          # Admin pages
│   │   │   ├── auth/           # Authentication pages
│   │   │   └── shop/           # Shop pages
│   │   ├── components/         # React components
│   │   │   ├── admin/          # Admin components
│   │   │   ├── auth/           # Auth components
│   │   │   ├── common/         # Shared components
│   │   │   └── ui/             # UI components
│   │   ├── config/             # Configuration files
│   │   ├── context/            # React contexts
│   │   ├── store/              # Redux store
│   │   ├── styles/             # CSS styles
│   │   ├── types/              # TypeScript types
│   │   └── utils/              # Utility functions
│   ├── package.json
│   ├── next.config.ts
│   └── tsconfig.json
│
├── server/                      # Backend (Node.js/Express)
│   ├── src/
│   │   ├── config/             # Database config
│   │   ├── controllers/        # Route controllers
│   │   ├── graphql/            # GraphQL schema & resolvers
│   │   ├── mail/               # Email templates
│   │   ├── middleware/         # Express middleware
│   │   ├── models/             # Mongoose models
│   │   ├── routers/            # Express routes
│   │   ├── services/           # Business logic
│   │   └── utils/              # Utility functions
│   ├── uploads/                # File uploads
│   ├── json/                   # JSON data files
│   ├── package.json
│   └── server.js
│
└── README.md                    # Documentation
```

## 🔧 Scripts có sẵn

### Client Scripts
```bash
npm run dev        # Chạy development server với Turbopack
npm run build      # Build production
npm run start      # Chạy production server
npm run lint       # Chạy ESLint
```

### Server Scripts
```bash
npm start          # Chạy server
```

## 🎨 Features đặc biệt

### 1. **Rich Product Management**
- Hỗ trợ đầy đủ thông tin game (achievements, requirements, videos)
- Upload multiple images và videos
- Dynamic form validation
- Real-time preview

### 2. **Advanced Authentication**
- Email verification với OTP
- Password strength validation
- Secure session management
- Role-based access control

### 3. **Modern UI/UX**
- Material Design 3
- Dark/Light theme switching
- Responsive design
- Smooth animations

### 4. **Internationalization**
- Multi-language support
- Dynamic language switching
- Localized content

### 5. **Performance Optimization**
- Next.js 15 với Turbopack
- Image optimization
- Code splitting
- Lazy loading

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

### Coding Standards
- Sử dụng TypeScript cho type safety
- Follow ESLint rules
- Viết test cho các tính năng mới
- Document code với JSDoc

## 📄 Giấy phép

Dự án này được phân phối dưới giấy phép MIT. Xem file `LICENSE` để biết thêm chi tiết.

## 👨‍💻 Tác giả

**Ha** - *Initial work*

## 🙏 Acknowledgments

- Material-UI team cho component library tuyệt vời
- Next.js team cho framework mạnh mẽ
- MongoDB team cho database solution
- Apollo GraphQL cho GraphQL implementation

## 📞 Liên hệ

Nếu bạn có bất kỳ câu hỏi nào, vui lòng tạo issue hoặc liên hệ trực tiếp.

---

⭐️ Nếu dự án này hữu ích, hãy cho chúng tôi một star!

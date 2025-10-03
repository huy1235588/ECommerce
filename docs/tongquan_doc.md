# Tổng Quan Dự Án: Bộ Sưu Tập Số Của Tôi (ECommerce)

## 1. Mục Tiêu Dự Án

Xây dựng một nền tảng thương mại điện tử về game sử dụng kiến trúc Microservices, cung cấp trải nghiệm mua sắm, quản lý thư viện game, và tương tác cộng đồng tương tự Steam.

## 2. Giá Trị Mang Lại

-   **Trải Nghiệm Người Dùng Cá Nhân Hóa**: Platform mua bán game, thư viện cá nhân, achievement system, và cộng đồng game thủ.
-   **Phát Triển Kỹ Năng Kỹ Thuật**: Áp dụng kiến trúc microservices phức tạp, xử lý thanh toán, và hệ thống real-time.
-   **Giá Trị Sản Phẩm**: Mô hình thương mại điện tử hoàn chỉnh cho game.

## 3. Quy Trình Phát Triển ("Documentation-First")

-   **Triết Lý**: Ưu tiên viết tài liệu trước khi code, coi tài liệu như bản thiết kế chi tiết để đảm bảo hiểu sâu vấn đề và phát hiện lỗi sớm.
-   **Công Cụ**: Sử dụng Obsidian để quản lý tài liệu dạng liên kết ngữ nghĩa, tạo bộ kiến thức có thể tái sử dụng.
-   **Nguyên Tắc Hướng Dẫn**: Áp dụng "Just Enough Design Upfront" để tránh phân tích quá mức, tập trung vào MVP (Minimum Viable Product).

## 4. Rủi Ro & Biện Pháp Giảm Thiểu

-   **Nguy Cơ Phân Tích Quá Mức**: Tập trung vào thiết kế vừa đủ, ưu tiên phát triển MVP.
-   **Chi Phí Bảo Trì Tài Liệu**: Tích hợp việc cập nhật tài liệu vào quy trình code, sử dụng công cụ như Swagger để đồng bộ hóa API.
-   **Thiếu Linh Hoạt**: Xem tài liệu như bản phác thảo sống, sẵn sàng điều chỉnh theo nhu cầu thực tế.

## 5. Công Nghệ Sử Dụng

### 5.1 Backend

-   **Framework**: Spring Boot, Java 17+
-   **Microservices**: Spring Cloud (Gateway, Config, Discovery)
-   **Database**: PostgreSQL (core data), MongoDB (game catalog, reviews), Redis (sessions, cache)
-   **Message Queue**: Apache Kafka/RabbitMQ
-   **Authentication**: Spring Security, JWT, OAuth2
-   **Payment Integration**: Stripe/PayPal integration
-   **API Documentation**: OpenAPI 3 (Swagger)
-   **Testing**: JUnit 5, Testcontainers, MockMVC

### 5.2 Frontend

-   **Framework**: Next.js 14+ (App Router)
-   **UI Library**: React 18+
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **UI Components**: Shadcn/UI, Radix UI
-   **Form Management**: React Hook Form
-   **Form Validation**: Zod
-   **State Management**: Redux Toolkit + RTK Query
-   **HTTP Client**: Axios
-   **Real-time**: WebSockets (Socket.IO)
-   **Internationalization**: next-intl
-   **Icons**: Lucide React, Heroicons
-   **Date/Time**: date-fns

### 5.3 Infrastructure & DevOps

-   **Containerization**: Docker, Docker Compose
-   **Orchestration**: Kubernetes
-   **CI/CD**: GitHub Actions
-   **Monitoring**: Prometheus, Grafana
-   **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
-   **Reverse Proxy**: Nginx
-   **Load Balancer**: HAProxy

### 5.4 Testing

-   **Frontend Testing**: Jest, React Testing Library, Playwright
-   **Backend Testing**: JUnit 5, Mockito, Testcontainers
-   **API Testing**: Postman, Newman
-   **Load Testing**: JMeter

### 5.5 Development Tools

-   **Code Quality**: ESLint, Prettier, SonarQube
-   **Git Hooks**: Husky, lint-staged
-   **Package Management**: npm/yarn (Frontend), Maven (Backend)
-   **IDE**: IntelliJ IDEA, VS Code

### 5.6 External APIs

#### 5.6.1 Gaming APIs

-   **IGDB**: Game metadata, covers, information
-   **Steam Web API**: Reference data (nếu cần)

#### 5.6.2 Payment Gateways

-   **Stripe**: Primary payment processing
-   **PayPal**: Alternative payment method

#### 5.6.3 File Storage

-   **AWS S3**: Game file storage
-   **CDN**: Global content delivery

## 6. Chiến Lược Triển Khai Git

Vì đây là dự án cá nhân, chiến lược Git cần đơn giản, hiệu quả và dễ quản lý để hỗ trợ phát triển độc lập mà vẫn đảm bảo chất lượng code và khả năng theo dõi lịch sử thay đổi.

### 6.1 Nguyên Tắc Cơ Bản

-   **Git Flow Đơn Giản Hóa**: Áp dụng phiên bản đơn giản của Git Flow phù hợp với cá nhân, tập trung vào tính linh hoạt và tốc độ phát triển.
-   **Branching Strategy**: Sử dụng các nhánh chính để tách biệt công việc phát triển, testing và production.
-   **Commit Messages**: Viết commit messages rõ ràng, mô tả ngắn gọn thay đổi và lý do (theo chuẩn Conventional Commits nếu có thể).
-   **Version Control**: Sử dụng tags cho các phiên bản release để dễ dàng theo dõi tiến độ dự án.

### 6.2 Cấu Trúc Nhánh

-   **main**: Nhánh chính chứa code ổn định, sẵn sàng cho production. Chỉ merge từ develop sau khi testing đầy đủ.
-   **develop**: Nhánh phát triển chính, tích hợp các tính năng mới từ feature branches.
-   **feature/\* (ví dụ: feature/collection-management)**: Nhánh cho từng tính năng cụ thể. Tạo từ develop, merge lại develop khi hoàn thành.
-   **hotfix/\* (ví dụ: hotfix/api-fix)**: Nhánh cho sửa lỗi khẩn cấp, tạo từ main và merge trực tiếp vào main và develop.

### 6.3 Workflow Phát Triển

1. **Bắt Đầu Tính Năng Mới**:

    - Tạo nhánh feature từ develop: `git checkout -b feature/new-feature develop`
    - Phát triển và commit thường xuyên với messages rõ ràng.

2. **Hoàn Thành Tính Năng**:

    - Merge feature branch vào develop: `git checkout develop && git merge feature/new-feature`
    - Xóa feature branch sau khi merge.

3. **Release**:

    - Khi develop ổn định, merge vào main: `git checkout main && git merge develop`
    - Tạo tag cho phiên bản: `git tag -a v1.0.0 -m "Release version 1.0.0"`

4. **Sửa Lỗi Khẩn Cấp**:
    - Tạo hotfix branch từ main: `git checkout -b hotfix/bug-fix main`
    - Sửa lỗi và merge vào main, sau đó cherry-pick vào develop.

### 6.4 Công Cụ Hỗ Trợ

-   **GitHub**: Lưu trữ repository, quản lý issues, pull requests (dù là cá nhân vẫn có thể dùng PR để review code tự).
-   **Git Extensions/GitKraken**: GUI tools để quản lý Git dễ dàng hơn.
-   **Pre-commit Hooks**: Sử dụng Husky hoặc tương tự để chạy linting, testing trước khi commit.

### 6.5 Best Practices Cho Dự Án Cá Nhân

-   **Commit Thường Xuyên**: Tránh commit lớn, chia nhỏ thay đổi để dễ theo dõi.
-   **.gitignore**: Loại bỏ files không cần thiết (build artifacts, IDE files, secrets).
-   **Backup**: Push thường xuyên lên GitHub để tránh mất dữ liệu.
-   **Documentation**: Ghi chú trong commit messages về các thay đổi lớn, đặc biệt liên quan đến kiến trúc microservices hoặc tích hợp API.

Chiến lược này giúp duy trì trật tự trong dự án phức tạp như ECommerce, đồng thời linh hoạt cho phát triển cá nhân.

## 7. Cấu Trúc Thư Mục Dự Án

### 7.1 Cấu Trúc Tổng Quan

```
ECommerce/
├── README.md
├── docker-compose.yml
├── .gitignore
├── docs/                           # Tài liệu dự án
├── infrastructure/                 # Infrastructure as Code
├── microservices/                  # Backend Microservices
├── frontend/                       # Next.js Frontend
├── data-pipeline/                  # Data Engineering
├── databases/                      # Database schemas & migrations
├── monitoring/                     # Monitoring & Observability
├── scripts/                        # Utility scripts
├── tests/                          # Integration & E2E tests
└── ci-cd/                          # CI/CD configurations
```

### 7.2 Cấu trúc thư mục docs

> **Lưu ý**: Cấu trúc dưới đây được thiết kế theo triết lý "Documentation-First", tập trung vào việc mô tả thiết kế, yêu cầu và kiến trúc trước khi triển khai code.

```
docs/
├── index.md                    # 📋 Trang chủ tài liệu chính
├── tongquan_doc.md             # 🎯 Tổng quan dự án (bản hiện tại)
├── 01-getting-started/         # 🚀 Khởi đầu dự án
│   ├── README.md                  # Mục lục và hướng dẫn section
│   ├── project-vision.md          # Tầm nhìn và mục tiêu dự án
│   ├── requirements.md            # Yêu cầu hệ thống và môi trường
│   ├── development-setup.md       # Thiết lập môi trường phát triển
│   └── documentation-workflow.md  # Quy trình làm việc với tài liệu
├── 02-architecture/            # 🏗️ Thiết kế kiến trúc
│   ├── README.md                  # Tổng quan kiến trúc hệ thống
│   ├── system-design.md           # Thiết kế tổng thể hệ thống
│   ├── microservices-design.md    # Thiết kế kiến trúc microservices
│   ├── data-architecture.md       # Kiến trúc dữ liệu và database
│   ├── security-design.md         # Thiết kế bảo mật
│   ├── integration-patterns.md    # Mẫu tích hợp và giao tiếp
│   └── scalability-strategy.md    # Chiến lược mở rộng hệ thống
├── 03-backend/                 # 🔧 Thiết kế Backend
│   ├── README.md                  # Tổng quan backend architecture
│   ├── services/                  # Thiết kế các microservices
│   │   ├── README.md                 # Mục lục và nguyên tắc thiết kế services
│   │   ├── service-template.md       # Template thiết kế service
│   │   ├── api-gateway-design.md     # Thiết kế API Gateway
│   │   ├── user-service-design.md    # Thiết kế User Service
│   │   ├── game-catalog-design.md    # Thiết kế Game Catalog Service
│   │   ├── order-service-design.md   # Thiết kế Order Service
│   │   ├── payment-service-design.md # Thiết kế Payment Service
│   │   └── notification-design.md    # Thiết kế Notification Service
│   ├── api-reference/             # Thiết kế API
│   │   ├── README.md                 # Nguyên tắc thiết kế API
│   │   ├── api-standards.md          # Chuẩn API và conventions
│   │   ├── error-handling.md         # Xử lý lỗi và response codes
│   │   └── swagger/                  # OpenAPI specifications theo service
│   │       ├── README.md                # API documentation overview
│   │       ├── api-gateway.yaml         # API Gateway endpoints
│   │       ├── user-service-api.yaml    # User Service API spec
│   │       ├── game-catalog-api.yaml    # Game Catalog API spec
│   │       ├── order-service-api.yaml   # Order Service API spec
│   │       ├── payment-service-api.yaml # Payment Service API spec
│   │       ├── inventory-api.yaml       # Inventory Service API spec
│   │       ├── notification-api.yaml    # Notification Service API spec
│   │       ├── review-service-api.yaml  # Review Service API spec
│   │       ├── achievement-api.yaml     # Achievement Service API spec
│   │       ├── social-service-api.yaml  # Social Service API spec
│   │       ├── file-service-api.yaml    # File Service API spec
│   │       └── shared-models.yaml       # Shared API models và schemas
│   ├── database/                  # Thiết kế cơ sở dữ liệu
│   │   ├── README.md                 # Tổng quan database strategy
│   │   ├── schemas/                  # Database schemas theo service
│   │   │   ├── README.md                # Database schemas overview
│   │   │   ├── user-service-db.md       # User Service database schema
│   │   │   ├── game-catalog-db.md       # Game Catalog database schema
│   │   │   ├── order-service-db.md      # Order Service database schema
│   │   │   ├── payment-service-db.md    # Payment Service database schema
│   │   │   ├── inventory-service-db.md  # Inventory Service database schema
│   │   │   ├── notification-db.md       # Notification Service database schema
│   │   │   ├── review-service-db.md     # Review Service database schema
│   │   │   ├── achievement-db.md        # Achievement Service database schema
│   │   │   ├── social-service-db.md     # Social Service database schema
│   │   │   └── shared-tables.md         # Shared database tables
│   │   ├── migrations/               # Migration strategy
│   │   │   ├── README.md                # Migration strategy overview
│   │   │   ├── migration-process.md     # Database migration process
│   │   │   ├── versioning-strategy.md   # Database versioning
│   │   │   └── rollback-procedures.md   # Rollback procedures
│   │   ├── queries/                  # Query optimization
│   │   │   ├── README.md                # Query optimization overview
│   │   │   ├── performance-queries.md   # High-performance queries
│   │   │   ├── indexing-strategy.md     # Database indexing strategy
│   │   │   └── query-patterns.md        # Common query patterns
│   │   └── event-store/              # Event sourcing design
│   │       ├── README.md                # Event sourcing overview
│   │       ├── event-schema.md          # Event schema design
│   │       ├── event-versioning.md      # Event versioning strategy
│   │       └── event-replay.md          # Event replay mechanisms
│   ├── messaging/                 # Thiết kế message queue
│   │   ├── README.md                 # Message queue strategy
│   │   ├── event-driven-design.md    # Event-driven architecture
│   │   ├── kafka-topics.md           # Kafka topics design
│   │   └── message-schemas.md        # Message schemas
│   └── shared-commons/            # Shared libraries design
│       ├── README.md                 # Shared components overview
│       ├── common-models.md          # Common data models
│       ├── utility-libraries.md     # Utility libraries design
│       └── cross-cutting-concerns.md # Logging, monitoring, etc.
├── 04-frontend/                # 🎨 Thiết kế Frontend
│   ├── README.md                  # Tổng quan frontend architecture
│   ├── user-experience/           # UX/UI Design
│   │   ├── README.md                 # UX strategy overview
│   │   ├── user-personas.md          # User personas và use cases
│   │   ├── user-journeys.md          # User journey mapping
│   │   ├── wireframes.md             # Wireframes và mockups
│   │   └── accessibility.md          # Accessibility requirements
│   ├── components/                # Thiết kế Component Architecture
│   │   ├── README.md                 # Component design principles
│   │   ├── design-system.md          # Design system specification
│   │   ├── component-library.md      # Component library design
│   │   ├── reusable-components.md    # Reusable components
│   │   └── component-patterns.md     # Component patterns
│   ├── pages/                     # Thiết kế Pages và Layouts
│   │   ├── README.md                 # Page architecture overview
│   │   ├── routing-strategy.md       # Routing strategy
│   │   ├── layout-design.md          # Layout components design
│   │   ├── page-specifications.md    # Individual page specs
│   │   └── navigation-design.md      # Navigation patterns
│   ├── store/                     # State Management Design
│   │   ├── README.md                 # State management strategy
│   │   ├── redux-architecture.md     # Redux store architecture
│   │   ├── data-flow.md              # Data flow patterns
│   │   └── caching-strategy.md       # Client-side caching
│   ├── styling/                   # Styling Strategy
│   │   ├── README.md                 # Styling approach overview
│   │   ├── design-tokens.md          # Design tokens system
│   │   ├── theme-system.md           # Theme configuration
│   │   ├── responsive-strategy.md    # Responsive design strategy
│   │   └── css-architecture.md       # CSS/Tailwind architecture
│   ├── hooks/                     # Custom Hooks Design
│   │   ├── README.md                 # Custom hooks strategy
│   │   ├── data-fetching-hooks.md    # Data fetching patterns
│   │   ├── state-hooks.md            # State management hooks
│   │   └── utility-hooks.md          # Utility hooks design
│   ├── internationalization/      # i18n Strategy
│   │   ├── README.md                 # Internationalization strategy
│   │   ├── locale-management.md      # Locale management
│   │   ├── translation-workflow.md   # Translation workflow
│   │   └── rtl-support.md            # RTL language support
│   └── layouts/                   # Layout System Design
│       ├── README.md                 # Layout system overview
│       ├── grid-system.md            # Grid system design
│       ├── responsive-layouts.md     # Responsive layout patterns
│       └── layout-components.md      # Layout component specs
└── assets/                     # 📁 Documentation Assets
    ├── README.md                  # Assets overview
    ├── images/                    # Documentation images
    │   ├── architecture/             # Architecture diagrams
    │   ├── wireframes/               # UI wireframes
    │   ├── flowcharts/               # Process flowcharts
    │   └── screenshots/              # Reference screenshots
    ├── diagrams/                  # Technical diagrams
    │   ├── system-architecture.md    # System architecture diagrams
    │   ├── database-erd.md           # Database ERD
    │   ├── api-flow-diagrams.md      # API flow diagrams
    │   └── deployment-diagrams.md    # Deployment architecture
    └── templates/                 # Documentation templates
        ├── README.md                   # Templates overview
        ├── frontend/                   # Frnonend templates
        │    ├── component-template.md          # Template for React components
        │    ├── layout-template.md             # Template for layout components
        │    ├── shook-template.md              # Template for custom hooks
        │    ├── page-template.md               # Template for pages
        │    ├── store-template.md              # Template for Redux store slices
        │    ├── utility-template.md            # Template for utility functions
        │    └── README.md
        └── server/                     # Server templates
            ├── database-schema-template.md     # Database schema template
            ├── deployment-guide-template.md    # Deployment guide template
            ├── guide-tutorial-template.md      # Tutorial/guide template
            ├── migration-template.md           # Database migration template
            ├── service-template.md             # Microservice design template
            ├── shared-utility-template.md      # Shared utility function template
            └── README.md
```

## 8. Mô Tả Chi Tiết Các Thành Phần

### 8.1 Microservices Architecture

#### 8.1.1 Dịch vụ thiết yếu (Giai đoạn 1)

-   **API Gateway**: Điểm vào duy nhất, định tuyến, giới hạn lưu lượng
-   **Service Discovery**: Eureka server để đăng ký và phát hiện dịch vụ
-   **User Service**: Hồ sơ người dùng, quản lý tài khoản
-   **Game Catalog Service**: Siêu dữ liệu game, tìm kiếm, phân loại theo danh mục
-   **Order Service**: Giỏ hàng, quản lý đơn hàng
-   **Inventory Service**: Quản lý key game và xác thực giấy phép

#### 8.1.2 Dịch vụ nâng cao (Giai đoạn 2)

-   **Payment Service**: Tích hợp Stripe/PayPal
-   **Notification Service**: Thông báo email và trong ứng dụng
-   **File Service**: Phân phối file game, quản lý CDN
-   **Review Service**: Đánh giá game, xếp hạng và bình luận

#### 8.1.3 Dịch vụ nâng cao (Giai đoạn 3)

-   **Dịch vụ Thành tựu**: Quản lý thành tựu người chơi, theo dõi tiến trình
-   **Dịch vụ Xã hội**: Hệ thống bạn bè, chat và cộng đồng
-   **Dịch vụ Phân tích**: Phân tích hành vi người dùng và doanh số

### 8.2 Frontend

-   **Next.js Application**: Framework React full‑stack với App Router, hỗ trợ SSR, SSG và server components
-   **React**: Thư viện theo component với hooks và các tính năng concurrent
-   **TypeScript**: An toàn kiểu (type‑safe) và cải thiện trải nghiệm nhà phát triển
-   **Tailwind CSS**: Framework CSS kiểu utility‑first cho việc tạo kiểu nhanh và nhất quán
-   **Shadcn/UI**: Thư viện component hiện đại, có khả năng truy cập (accessible) và dễ tuỳ chỉnh
-   **React Hook Form**: Quản lý form hiệu suất cao, giảm re‑render không cần thiết
-   **Zod**: Xác thực schema thân thiện với TypeScript
-   **Redux Toolkit**: Quản lý state đơn giản và hiệu quả
-   **RTK Query**: Quản lý dữ liệu server‑state, caching và đồng bộ hoá
-   **Axios**: Thư viện HTTP client để giao tiếp với backend API
-   **date-fns**: Xử lý ngày giờ nhẹ và modular
-   **Lucide React & Heroicons**: Bộ icon SVG có thể tuỳ chỉnh
-   **next-themes**: Hỗ trợ chế độ sáng/tối (light/dark mode)
-   **next-intl**: Hỗ trợ quốc tế hoá, tương thích với server components
-   **Tích hợp API**: API routes tích hợp trong Next.js, server actions và client‑side fetching để tương tác với backend

### 8.3 Infrastructure

-   **Docker**: Containerization cho các services
-   **Kubernetes**: Orchestration
-   **Kafka**: Message queue cho giao tiếp bất đồng bộ
-   **Databases**: PostgreSQL cho dữ liệu quan hệ, MongoDB cho dữ liệu linh hoạt, Redis cho caching

### 8.4 Data Pipeline

-   **Airflow**: Orchestrate ETL processes
-   **Spark**: Big data processing nếu cần
-   **ETL Scripts**: Extract data from external APIs, transform, load into databases

### 8.5 Monitoring

-   **Prometheus**: Metrics collection
-   **Grafana**: Dashboards
-   **ELK Stack**: Logging and visualization

## ## 9. Database Strategy

### 9.1 PostgreSQL (Structured Data)

-   User accounts & profiles
-   Orders & transactions
-   Inventory & game keys
-   Achievements & user progress
-   Payments & financial data

### 9.2 MongoDB (Flexible Data)

-   Game catalog & metadata
-   User reviews & comments
-   Game descriptions & media
-   User activity logs

### 9.3 Redis (Performance)

-   User sessions
-   Shopping carts
-   API rate limiting
-   Game catalog cache

# Tổng Quan Dự Án: Bộ Sưu Tập Số Của Tôi (ECommerce)

## 1. Mục Tiêu Dự Án

Xây dựng một nền tảng thương mại điện tử về game sử dụng kiến trúc Microservices, cung cấp trải nghiệm mua sắm, quản lý thư viện game, và tương tác cộng đồng tương tự Steam.

## 2. Giá Trị Mang Lại

-   **Trải Nghiệm Người Dùng Cá Nhân Hóa**: Platform mua bán game, thư viện cá nhân, achievement system, và cộng đồng game thủ.
-   **Phát Triển Kỹ Năng Kỹ Thuật**: Áp dụng kiến trúc microservices phức tạp, xử lý thanh toán, và hệ thống real-time.
-   **Giá Trị Sản Phẩm**: Mô hình thương mại điện tử hoàn chỉnh cho game.

## 3. Quy Trình Phát Triển ("Documentation-First")

-   **Triết Lý**: Ưu tiên viết tài liệu trước khi code, tập trung vào thiết kế microservices.
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

### 7.2 Cấu trúc thư mục docs tối ưu

```
docs/
├── README.md                   # Trang chủ tài liệu chính
├── tongquan.md                 # Tổng quan dự án (Overview)
├── 01-getting-started/         # 🚀 Bắt đầu nhanh
│   ├── README.md                  # Mục lục section
│   ├── 01-prerequisites.md        # Yêu cầu hệ thống
│   ├── 02-setup.md                # Thiết lập môi trường
│   ├── 03-quickstart.md           # Khởi động nhanh
│   └── 04-first-run.md            # Chạy lần đầu
├── 02-architecture/            # 🏗️ Kiến trúc dự án
│   ├── README.md                  # Mục lục kiến trúc
│   ├── 01-overview.md             # Tổng quan kiến trúc
│   ├── 02-microservices.md        # Kiến trúc microservices
│   ├── 03-data-flow.md            # Luồng dữ liệu
│   ├── 04-security.md             # Kiến trúc bảo mật
│   └── diagrams/                  # Sơ đồ kiến trúc
│       ├── system-overview.md
│       ├── microservices-diagram.md
│       └── database-erd.md
├── 03-backend/                 # 🔧 Backend Documentation
│   ├── README.md                  # Mục lục backend
│   ├── services/                  # Tài liệu microservices
│   │   ├── README.md                 # Mục lục services
│   │   ├── user-service.md           # Dịch vụ người dùng
│   │   ├── collection-service.md     # Dịch vụ bộ sưu tập
│   │   ├── item-service.md           # Dịch vụ mục
│   │   ├── metadata-service.md       # Dịch vụ metadata
│   │   ├── notification-service.md   # Dịch vụ thông báo
│   │   ├── api-gateway.md            # API Gateway
│   │   ├── discovery-service.md      # Discovery Service
│   │   └── config-service.md         # Config Service
│   ├── api-reference/             # Tài liệu API chi tiết
│   │   ├── README.md                 # API Overview
│   │   ├── authentication.md         # API xác thực
│   │   ├── users.md                  # API người dùng
│   │   ├── collections.md            # API bộ sưu tập
│   │   ├── items.md                  # API mục
│   │   ├── metadata.md               # API metadata
│   │   ├── notifications.md          # API thông báo
│   │   └── swagger/                  # OpenAPI specs
│   └── database/                  # Tài liệu cơ sở dữ liệu
│       ├── README.md                 # Database overview
├── 04-frontend/                # 🎨 Frontend Documentation
│   ├── README.md                  # Mục lục và tổng quan frontend
│   ├── components/                # 🧩 Component Development
│   ├── store/                     # 🔄 State Management
│   ├── styling/                   # 🎨 Styling & UI
│   │   ├── README.md                  # Styling overview
│   │   ├── design-system.md           # Design System
│   │   ├── component-styles.md        # Component Styles
│   │   ├── theme-configuration.md     # Theme Configuration
│   │   ├── responsive-design.md       # Responsive Design
│   │   ├── animations.md              # Animations
│   │   └── utilities.md              # Utilities
│   ├── hooks/                     # 🪝 Custom Hooks
│   ├── internationalization/      # 🌐 Internationalization
│   └── pages/                     # 📄 Page Documentation
│       ├── README.md                  # Pages overview
│       ├── login-page.md                # Login page docs
│       ├── register-page.md             # Register page docs
│       ├── dashboard-page.md            # Dashboard page docs
│       ├── user-profile-page.md         # User profile page docs
│       ├── collections-list-page.md     # Collections list page docs
│       ├── collection-detail-page.md    # Collection detail page docs
│       ├── create-collection-page.md    # Create collection page docs
│       ├── create-item-page.md          # Create item page docs
│       └── item-detail-page.md          # Item detail page docs
├── 05-deployment/              # 🚀 Triển khai & DevOps
│   ├── README.md                  # Deployment overview
│   ├── local-development.md       # Phát triển local
│   ├── docker.md                  # Triển khai với Docker
│   ├── kubernetes.md              # Triển khai với K8s
│   ├── ci-cd.md                   # CI/CD pipeline
│   ├── monitoring.md              # Monitoring & Observability
│   ├── security.md                # Security deployment
│   └── environments/              # Môi trường cụ thể
│       ├── development.md
│       ├── staging.md
│       └── production.md
├── 06-development/             # 👨‍💻 Hướng dẫn phát triển
│   ├── README.md                  # Development overview
│   ├── coding-standards.md        # Tiêu chuẩn code
│   ├── git-workflow.md            # Quy trình Git
│   ├── debugging.md               # Gỡ lỗi
│   ├── code-review.md             # Code review process
│   ├── performance.md             # Performance guidelines
│   └── best-practices.md          # Best practices
├── 07-testing/                 # 🧪 Testing Strategy
│   ├── README.md                  # Testing overview
│   ├── unit-tests.md              # Unit tests
│   ├── integration-tests.md       # Integration tests
│   ├── e2e-tests.md               # End-to-end tests
│   ├── api-tests.md               # API testing
│   ├── performance-tests.md       # Performance testing
│   └── test-data.md               # Test data management
├── 08-guides/                  # 📝 Hướng dẫn chuyên đề
│   ├── README.md                  # Guides overview
│   ├── adding-new-service.md      # Thêm microservice mới
│   ├── external-api-integration.md # Tích hợp API bên ngoài
│   ├── database-migration.md      # Migration database
│   ├── performance-optimization.md # Tối ưu performance
│   └── security-hardening.md      # Bảo mật hệ thống
├── 09-troubleshooting/         # 🔧 Khắc phục sự cố
│   ├── README.md                  # Troubleshooting overview
│   ├── common-issues.md           # Vấn đề thường gặp
│   ├── error-codes.md             # Mã lỗi & giải thích
│   ├── debugging-guide.md         # Hướng dẫn debug
│   ├── performance-issues.md      # Vấn đề performance
│   └── faq.md                     # Câu hỏi thường gặp
├── 10-references/              # 📚 Tài liệu tham khảo
│   ├── README.md                  # References overview
│   ├── technology-stack.md        # Stack công nghệ
│   ├── external-apis.md           # API bên ngoài
│   ├── dependencies.md            # Dependencies
│   ├── glossary.md                # Thuật ngữ
│   └── resources.md               # Tài nguyên học tập
├── changelog/                  # 📋 Nhật ký thay đổi
│   ├── README.md                  # Changelog overview
│   ├── v1.0.0.md                  # Phiên bản 1.0.0
│   ├── v0.9.0.md                  # Phiên bản 0.9.0
│   └── unreleased.md              # Thay đổi chưa release
├── contributing/               # 🤝 Hướng dẫn đóng góp
│   ├── README.md                  # Contributing overview
│   ├── guidelines.md              # Nguyên tắc đóng góp
│   ├── pull-requests.md           # Pull requests
│   ├── issue-templates.md         # Templates cho issues
│   └── code-of-conduct.md         # Quy tắc ứng xử
└── assets/                     # 📁 Tài nguyên tĩnh
    ├── images/                    # Hình ảnh
    ├── diagrams/                  # Sơ đồ
    └── templates/                 # Templates tài liệu
        ├── api-documentation-template.md
        ├── deployment-guide-template.md
        ├── guide-tutorial-template.md
        ├── obsidian-setup-guide.md
        ├── section-readme-template.md
        ├── service-documentation-template.md
        ├── troubleshooting-template.md
        ├── migration-template.md
        ├── shared-utility-template.md
        └── frontend/                      # 🎨 Frontend-specific templates
            ├── README.md                     # Frontend templates overview
            ├── component-template.md                  # React component docs
            ├── feature-template.md                    # Feature docs
            ├── page-template.md                       # Next.js page docs
            ├── hook-template.md                       # Custom hooks docs
            ├── styling-guide-template.md              # Styling guidelines
            ├── store-template.md                      # State management docs
            └── i18n-template.md       # i18n setup guide
```

### 7.3 Cấu trúc thư mục infrastructure

```
infrastructure/
├── kubernetes/                 # K8s manifests
│   ├── deployments/
│   ├── services/
│   ├── configmaps/
│   ├── secrets/
│   └── ingress/
├── terraform/                  # Infrastructure provisioning
│   ├── modules/
│   ├── environments/
│   └── main.tf
└── monitoring/                 # Prometheus, Grafana configs
    ├── prometheus/
    └── grafana/
```

### 7.4 Cấu trúc thư mục microservices

```
microservices/
├── api-gateway/                   # Spring Cloud Gateway
├── service-discovery/             # Eureka Server
├── config-service/                # Spring Cloud Config
├── user-service/                  # User management & auth
├── game-catalog-service/          # Game information & metadata
├── inventory-service/             # Game keys & licenses
├── order-service/                 # Orders & payments
├── payment-service/               # Payment processing
├── notification-service/          # Email & real-time notifications
├── achievement-service/           # Player achievements
├── review-service/                # Game reviews & ratings
├── file-service/                  # Game file distribution
└── social-service/                # Friends, chat, communities
```

### 7.5 Cấu trúc thư mục frontend

```
frontend/                      # Next.js Frontend
├── src/
│   ├── app/                   # App Router (Next.js 13+)
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Home page
│   │   ├── (auth)/                # Authentication routes
│   │   ├── store/                 # Game store pages
│   │   ├── library/               # User game library
│   │   ├── profile/               # User profile & achievements
│   │   ├── admin/                 # Admin dashboard
│   │   └── api/                   # API routes
│   ├── components/            # React components
│   │   ├── games/                 # Game cards, search, filters
│   │   ├── store/                 # Store components
│   │   ├── library/               # Library components
│   │   ├── achievement/           # Achievement components
│   │   └── ui/                    # Shadcn/UI components
│   ├── lib/                   # Utility libraries
│   │   ├── api.ts             # API client (Axios)
│   │   ├── auth.ts            # Authentication utilities
│   │   ├── utils.ts           # General utilities
│   │   ├── validations.ts     # Zod schemas
│   │   ├── constants.ts       # App constants
│   │   └── i18n.ts            # Internationalization config
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useCollections.ts
│   │   └── useItems.ts
│   ├── store/                 # State management (Redux Toolkit)
│   │   ├── index.ts
│   │   ├── userSlice.ts
│   │   ├── collectionSlice.ts
│   │   └── itemSlice.ts
│   ├── types/                 # TypeScript type definitions
│   │   ├── auth.ts
│   │   ├── collection.ts
│   │   └── api.ts
│   └── styles/                # Stylesheets
│       ├── globals.css
│       ├── components.css
│       └── pages.css
├── public/                    # Static files
│   ├── images/
│   ├── icons/
│   └── favicon.ico
├── messages/                  # Translation files (i18n)
│   ├── en.json
│   └── vi.json
├── tests/                     # Tests
│   ├── __tests__/             # Jest tests
│   ├── e2e/                   # Playwright E2E tests
│   └── setup.ts               # Test setup
├── package.json
├── next.config.js             # Next.js configuration
├── tailwind.config.js         # Tailwind CSS config
├── components.json            # Shadcn/UI config
├── tsconfig.json              # TypeScript config
├── jest.config.js             # Jest config
├── playwright.config.ts       # E2E test config
├── eslint.config.js           # ESLint config
├── prettier.config.js         # Prettier config
├── .env.local                 # Environment variables
├── .env.example               # Environment variables template
└── README.md
```

### 7.6 Cấu trúc thư mục data-pipeline

```
data-pipeline/                 # Data Engineering
├── kafka/                     # Kafka configurations
├── airflow/                   # Airflow DAGs
│   ├── dags/
│   └── plugins/
├── spark/                     # Spark jobs
│   ├── jobs/
│   └── libs/
└── etl/                       # ETL scripts
    ├── extractors/
    ├── transformers/
    └── loaders/
```

### 7.7 Cấu trúc thư mục databases

```
databases/                     # Database schemas & migrations
├── postgresql/
│   ├── migrations/
│   └── seeds/
├── mongodb/
│   └── collections/
└── redis/                     # For caching
    └── schemas/
```

### 7.8 Cấu trúc thư mục monitoring

```
monitoring/                    # Monitoring & Observability
│   ├── prometheus/
│   ├── grafana/
│   │   └── dashboards/
│   └── elk/                       # Elasticsearch, Logstash, Kibana
```

### 7.8 Cấu trúc thư mục scripts

```
scripts/                       # Utility scripts
├── setup/                     # Environment setup
├── deployment/                # Deployment scripts
└── data/                      # Data management scripts
```

### 7.9 Cấu trúc thư mục tests

```
tests/                         # Integration & E2E tests
├── integration/
├── e2e/
└── performance/
```

### 7.10 Cấu trúc thư mục ci-cd

```
ci-cd/                         # CI/CD configurations
├── jenkins/
├── github-actions/
└── helm-charts/
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

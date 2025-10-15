# Admin Panel - E-Commerce

## Tổng quan

Admin Panel là hệ thống quản trị hoàn chỉnh cho nền tảng E-Commerce game, được xây dựng với Next.js 14, React, TypeScript và Tailwind CSS.

## Cấu trúc

```
frontend/src/app/(admin)/
├── layout.tsx                    # Layout chính cho admin
├── _components/                  # Components riêng cho admin
│   ├── admin-sidebar.tsx        # Sidebar navigation
│   └── admin-header.tsx         # Header với search, notifications
└── admin/                        # Các trang admin
    ├── page.tsx                 # Dashboard chính
    ├── analytics/               # Thống kê tổng quan
    │   └── page.tsx
    ├── games/                   # Quản lý trò chơi
    │   └── page.tsx
    ├── categories/              # Quản lý thể loại
    │   └── page.tsx
    ├── publishers/              # Quản lý nhà phát hành
    │   └── page.tsx
    ├── promotions/              # Quản lý khuyến mãi
    │   └── page.tsx
    ├── banners/                 # Quản lý banner & slide
    │   └── page.tsx
    ├── orders/                  # Quản lý đơn hàng
    │   └── page.tsx
    ├── transactions/            # Quản lý giao dịch
    │   └── page.tsx
    ├── refunds/                 # Quản lý hoàn tiền
    │   └── page.tsx
    ├── users/                   # Quản lý tài khoản người dùng
    │   └── page.tsx
    ├── user-games/              # Quản lý thư viện game người dùng
    │   └── page.tsx
    ├── support/                 # Quản lý hỗ trợ
    │   └── page.tsx
    ├── reports/                 # Báo cáo & phân tích
    │   ├── revenue/             # Báo cáo doanh thu
    │   ├── game-analytics/      # Phân tích game
    │   └── user-analytics/      # Phân tích người dùng
    └── settings/                # Cài đặt hệ thống
        ├── payment/             # Cài đặt thanh toán
        ├── general/             # Cài đặt chung
        └── admins/              # Quản lý quản trị viên
```

## Tính năng

### 1. Tổng quan

#### Dashboard (/admin)

- Tổng quan doanh thu, đơn hàng, người dùng, trò chơi
- Danh sách đơn hàng gần đây
- Thống kê nhanh với biểu đồ

#### Thống kê (/admin/analytics)

- Biểu đồ tổng quan hệ thống
- Phân tích xu hướng
- Metrics chính

### 2. Quản lý nội dung

#### Trò chơi (/admin/games)

- Danh sách tất cả trò chơi
- Tìm kiếm và lọc trò chơi
- Thêm, sửa, xóa trò chơi
- Quản lý trạng thái trò chơi
- Upload và quản lý hình ảnh

#### Thể loại (/admin/categories)

- Danh sách thể loại trò chơi
- Cấu trúc thể loại cha-con
- Thêm, sửa, xóa thể loại
- Quản lý slug và SEO

#### Nhà phát hành (/admin/publishers)

- Danh sách nhà phát hành
- Thông tin chi tiết nhà phát hành
- Quản lý liên kết với trò chơi
- Thêm, sửa, xóa nhà phát hành

#### Khuyến mãi (/admin/promotions)

- Danh sách chương trình khuyến mãi
- Tạo và quản lý mã giảm giá
- Cấu hình điều kiện áp dụng
- Theo dõi hiệu quả khuyến mãi

#### Banner & Slide (/admin/banners)

- Quản lý banner trang chủ
- Upload và chỉnh sửa hình ảnh
- Cấu hình thứ tự hiển thị
- Responsive design

### 3. Quản lý giao dịch

#### Đơn hàng (/admin/orders)

- Danh sách tất cả đơn hàng
- Chi tiết đơn hàng
- Cập nhật trạng thái đơn hàng
- Tìm kiếm và lọc theo trạng thái
- Theo dõi quá trình giao hàng

#### Giao dịch (/admin/transactions)

- Lịch sử tất cả giao dịch
- Chi tiết giao dịch thanh toán
- Tích hợp với cổng thanh toán
- Báo cáo giao dịch

#### Hoàn tiền (/admin/refunds)

- Quản lý yêu cầu hoàn tiền
- Xử lý hoàn tiền tự động
- Theo dõi trạng thái hoàn tiền
- Báo cáo hoàn tiền

### 4. Quản lý người dùng

#### Tài khoản (/admin/users)

- Danh sách người dùng
- Thông tin chi tiết tài khoản
- Quản lý trạng thái tài khoản
- Phân quyền người dùng

#### Thư viện game (/admin/user-games)

- Xem thư viện game của người dùng
- Quản lý quyền truy cập
- Theo dõi lịch sử tải game

#### Hỗ trợ (/admin/support)

- Quản lý ticket hỗ trợ
- Chat với người dùng
- Câu hỏi thường gặp
- Báo cáo hỗ trợ

### 5. Báo cáo & phân tích

#### Báo cáo doanh thu (/admin/reports/revenue)

- Báo cáo doanh thu theo thời gian
- Phân tích lợi nhuận
- Xu hướng doanh thu
- Báo cáo chi tiết

#### Phân tích game (/admin/reports/game-analytics)

- Thống kê trò chơi bán chạy
- Phân tích tương tác người dùng
- Báo cáo hiệu suất game

#### Phân tích người dùng (/admin/reports/user-analytics)

- Thống kê hành vi người dùng
- Phân tích tỷ lệ chuyển đổi
- Báo cáo retention

### 6. Hệ thống

#### Cài đặt thanh toán (/admin/settings/payment)

- Cấu hình cổng thanh toán
- Quản lý phương thức thanh toán
- Cài đặt phí giao dịch

#### Cài đặt chung (/admin/settings/general)

- Cấu hình hệ thống
- Quản lý email templates
- Cài đặt thông báo

#### Quản trị viên (/admin/settings/admins)

- Quản lý tài khoản admin
- Phân quyền admin
- Nhật ký hoạt động

## Components chính

### AdminSidebar

- Navigation menu với icon
- Collapsible sidebar (thu gọn/mở rộng)
- Responsive design
- Active state highlighting
- Keyboard shortcut support (Ctrl/Cmd + B)

### AdminHeader

- Search bar toàn cục
- Theme toggle (Dark/Light mode)
- Notifications dropdown
- User menu với logout

## Routing

Tất cả các route admin được bảo vệ bởi layout group `(admin)`:

- `/admin` - Dashboard
- `/admin/analytics` - Thống kê tổng quan
- `/admin/games` - Quản lý trò chơi
- `/admin/categories` - Quản lý thể loại
- `/admin/publishers` - Quản lý nhà phát hành
- `/admin/promotions` - Quản lý khuyến mãi
- `/admin/banners` - Quản lý banner & slide
- `/admin/orders` - Quản lý đơn hàng
- `/admin/transactions` - Quản lý giao dịch
- `/admin/refunds` - Quản lý hoàn tiền
- `/admin/users` - Quản lý tài khoản người dùng
- `/admin/user-games` - Quản lý thư viện game
- `/admin/support` - Quản lý hỗ trợ
- `/admin/reports/revenue` - Báo cáo doanh thu
- `/admin/reports/game-analytics` - Phân tích game
- `/admin/reports/user-analytics` - Phân tích người dùng
- `/admin/settings/payment` - Cài đặt thanh toán
- `/admin/settings/general` - Cài đặt chung
- `/admin/settings/admins` - Quản lý quản trị viên

## UI Components sử dụng

- **shadcn/ui**: Card, Button, Input, Badge, Avatar, Dropdown Menu
- **Lucide React**: Icons
- **Sidebar Component**: Custom sidebar với collapsible
- **Theme Provider**: Dark/Light mode support

## Responsive Design

- **Mobile** (< 768px): Sidebar thu gọn thành sheet/drawer
- **Tablet** (768px - 1024px): Sidebar icon mode
- **Desktop** (> 1024px): Full sidebar với labels

## Dark Mode

Tất cả các trang admin đều hỗ trợ dark mode thông qua ThemeProvider:

- Tự động theo hệ thống
- Có thể toggle thủ công
- Transition mượt mà giữa các theme

## Tùy chỉnh

### Thêm menu item mới

Chỉnh sửa file `_components/admin-sidebar.tsx`:

```tsx
const menuItems = [
    {
        title: "Nhóm mới",
        items: [
            {
                title: "Tên menu",
                url: "/admin/route",
                icon: IconComponent,
            },
        ],
    },
];
```

### Thêm trang mới

1. Tạo folder mới trong `admin/`
2. Tạo file `page.tsx`
3. Export metadata và component

```tsx
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tiêu đề - Admin",
    description: "Mô tả",
};

export default function NewPage() {
    return <div>Nội dung trang</div>;
}
```

## Best Practices

1. **Metadata**: Luôn thêm metadata cho SEO
2. **Loading States**: Thêm loading skeleton cho trải nghiệm tốt hơn
3. **Error Handling**: Xử lý lỗi một cách graceful
4. **Accessibility**: Sử dụng semantic HTML và ARIA labels
5. **Performance**: Lazy load components khi cần thiết
6. **Type Safety**: Sử dụng TypeScript cho type safety

## Tích hợp API (Sắp tới)

Các trang hiện tại đang sử dụng dữ liệu mẫu. Để tích hợp với backend:

1. Tạo API services trong `src/services/`
2. Sử dụng Redux Toolkit cho state management
3. Implement loading và error states
4. Thêm optimistic updates cho UX tốt hơn

## License

© 2024 E-Commerce Platform

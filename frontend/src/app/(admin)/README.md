# Admin Panel - E-Commerce

## Tổng quan

Admin Panel là hệ thống quản trị hoàn chỉnh cho nền tảng E-Commerce, được xây dựng với Next.js 14, React, TypeScript và Tailwind CSS.

## Cấu trúc

```
frontend/src/app/(admin)/
├── layout.tsx                    # Layout chính cho admin
├── _components/                  # Components riêng cho admin
│   ├── admin-sidebar.tsx        # Sidebar navigation
│   └── admin-header.tsx         # Header với search, notifications
└── admin/                        # Các trang admin
    ├── page.tsx                 # Dashboard chính
    ├── products/                # Quản lý sản phẩm
    │   └── page.tsx
    ├── orders/                  # Quản lý đơn hàng
    │   └── page.tsx
    ├── customers/               # Quản lý khách hàng
    │   └── page.tsx
    ├── categories/              # Quản lý danh mục
    │   └── page.tsx
    ├── analytics/               # Thống kê và phân tích
    │   └── page.tsx
    └── settings/                # Cài đặt hệ thống
        └── page.tsx
```

## Tính năng

### 1. Dashboard (/)

- Tổng quan doanh thu, đơn hàng, khách hàng, sản phẩm
- Danh sách đơn hàng gần đây
- Thống kê nhanh với biểu đồ

### 2. Quản lý sản phẩm (/admin/products)

- Danh sách tất cả sản phẩm
- Tìm kiếm và lọc sản phẩm
- Thêm, sửa, xóa sản phẩm
- Quản lý tồn kho
- Trạng thái sản phẩm (Đang bán, Sắp hết, Hết hàng)

### 3. Quản lý đơn hàng (/admin/orders)

- Danh sách tất cả đơn hàng
- Chi tiết đơn hàng
- Cập nhật trạng thái đơn hàng
- Tìm kiếm và lọc theo trạng thái
- Theo dõi quá trình giao hàng

### 4. Quản lý khách hàng (/admin/customers)

- Danh sách khách hàng
- Thông tin chi tiết khách hàng
- Lịch sử mua hàng
- Phân loại khách hàng (VIP, Thường, Mới)
- Thống kê chi tiêu của khách hàng

### 5. Quản lý danh mục (/admin/categories)

- Danh sách danh mục sản phẩm
- Cấu trúc danh mục cha-con
- Thêm, sửa, xóa danh mục
- Quản lý slug và SEO
- Đếm số sản phẩm trong mỗi danh mục

### 6. Thống kê (/admin/analytics)

- Biểu đồ doanh thu theo tháng
- Top sản phẩm bán chạy
- Tỷ lệ chuyển đổi
- Giá trị tồn kho
- Phân tích xu hướng

### 7. Cài đặt (/admin/settings)

- Thông tin cửa hàng
- Cài đặt thanh toán (COD, Banking, VNPay, MoMo)
- Cài đặt vận chuyển
- Cài đặt thông báo (Email, SMS)
- Tùy chỉnh giao diện

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
- `/admin/products` - Quản lý sản phẩm
- `/admin/orders` - Quản lý đơn hàng
- `/admin/customers` - Quản lý khách hàng
- `/admin/categories` - Quản lý danh mục
- `/admin/analytics` - Thống kê
- `/admin/settings` - Cài đặt

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

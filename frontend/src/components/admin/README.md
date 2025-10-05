# Trang Quản Lý Người Dùng (User Management)

## Tổng quan

Trang quản lý người dùng cung cấp giao diện hoàn chỉnh để quản trị viên quản lý tất cả các tài khoản người dùng trên hệ thống, bao gồm tạo, chỉnh sửa, xóa và phân quyền.

## Đường dẫn

- **Danh sách người dùng**: `/admin/users`
- **Chi tiết người dùng**: `/admin/users/[id]`

## Tính năng chính

### 1. Dashboard Thống kê

- **Tổng người dùng**: Hiển thị tổng số tài khoản
- **Đã xác thực**: Số lượng người dùng đã xác thực email
- **Chưa xác thực**: Số lượng người dùng chưa xác thực
- **Quản trị viên**: Số lượng tài khoản admin

### 2. Bộ lọc & Tìm kiếm

#### Tìm kiếm

- Tìm theo tên đăng nhập
- Tìm theo email
- Tìm theo họ tên

#### Bộ lọc

- **Theo vai trò**:
    - Tất cả
    - Admin
    - Moderator
    - User
- **Theo trạng thái**:
    - Tất cả
    - Đã xác thực
    - Chưa xác thực

### 3. Quản lý người dùng

#### Xem danh sách

- Hiển thị thông tin người dùng dạng bảng
- Avatar tự động tạo
- Badge vai trò và trạng thái
- Thông tin đăng nhập lần cuối

#### Thao tác

- **Xem chi tiết**: Xem thông tin đầy đủ của người dùng
- **Chỉnh sửa**: Cập nhật thông tin người dùng
- **Xác thực/Hủy xác thực**: Toggle trạng thái xác thực
- **Đặt làm Admin**: Thay đổi vai trò thành admin
- **Xóa**: Xóa tài khoản người dùng

### 4. Tạo người dùng mới

Form tạo người dùng bao gồm:

- Họ và tên
- Tên đăng nhập
- Email
- Mật khẩu (tối thiểu 6 ký tự)
- Quốc gia
- Vai trò

### 5. Xuất dữ liệu

- Xuất danh sách người dùng ra file CSV
- Bao gồm tất cả thông tin cơ bản

### 6. Trang chi tiết người dùng

#### Thông tin cơ bản

- Avatar và tên đầy đủ
- Email, quốc gia
- Ngày tham gia, đăng nhập lần cuối
- Vai trò và trạng thái xác thực

#### Tabs

##### Hoạt động

- Lịch sử hoạt động gần đây
- Timeline các hành động

##### Đơn hàng

- Danh sách đơn hàng đã mua
- Trạng thái đơn hàng
- Tổng tiền

##### Thư viện game

- Các game đang sở hữu
- Thời gian đã chơi

##### Cài đặt

- Quản lý vai trò
- Trạng thái xác thực
- Khóa tài khoản

## Cấu trúc thư mục

```
admin/users/
├── page.tsx                          # Trang danh sách người dùng
├── [id]/
│   └── page.tsx                     # Trang chi tiết người dùng
├── _components/
│   ├── create-user-dialog.tsx       # Dialog tạo người dùng
│   ├── user-stats.tsx               # Component thống kê
│   └── index.ts                     # Export components
└── README.md                         # Tài liệu này
```

## Components

### UsersPage (`page.tsx`)

Component chính hiển thị danh sách người dùng.

**Props**: Không có

**State**:

- `users`: Danh sách tất cả người dùng
- `filteredUsers`: Danh sách người dùng sau khi lọc
- `searchQuery`: Từ khóa tìm kiếm
- `roleFilter`: Bộ lọc theo vai trò
- `statusFilter`: Bộ lọc theo trạng thái
- `selectedUser`: Người dùng được chọn
- `isEditDialogOpen`: Trạng thái dialog chỉnh sửa
- `isDeleteDialogOpen`: Trạng thái dialog xóa
- `isCreateDialogOpen`: Trạng thái dialog tạo mới

**Functions**:

- `fetchUsers()`: Lấy danh sách người dùng từ API
- `handleEditUser(user)`: Mở dialog chỉnh sửa
- `handleDeleteUser(user)`: Mở dialog xác nhận xóa
- `confirmDeleteUser()`: Xác nhận và xóa người dùng
- `handleToggleUserStatus(userId)`: Toggle trạng thái xác thực
- `handleChangeRole(userId, role)`: Thay đổi vai trò
- `exportUsers()`: Xuất dữ liệu ra CSV

### UserDetailPage (`[id]/page.tsx`)

Component hiển thị chi tiết người dùng.

**Props**: Không có (lấy id từ URL params)

**Features**:

- Hiển thị thông tin đầy đủ
- Tabs cho các thông tin bổ sung
- Nút chỉnh sửa và xóa

### CreateUserDialog

Dialog form tạo người dùng mới.

**Props**:

- `open`: Boolean - Trạng thái mở/đóng
- `onOpenChange`: Function - Callback khi thay đổi trạng thái
- `onUserCreated`: Function - Callback sau khi tạo thành công

**Features**:

- Validation form đầy đủ
- Loading state
- Toast notification

### UserStats

Component hiển thị thống kê người dùng.

**Props**:

- `totalUsers`: Number - Tổng số người dùng
- `verifiedUsers`: Number - Số người dùng đã xác thực
- `unverifiedUsers`: Number - Số người dùng chưa xác thực
- `adminUsers`: Number - Số quản trị viên

**Features**:

- 4 cards thống kê
- Icons màu sắc phân biệt
- Responsive grid layout

## API Integration

### Endpoints sử dụng

```typescript
// Lấy tất cả người dùng (phân trang)
GET /users?page=1&limit=10

// Lấy chi tiết người dùng
GET /users/:id

// Tạo người dùng mới
POST /users

// Cập nhật người dùng
PUT /users/:id

// Xóa người dùng
DELETE /users/:id

// Cập nhật vai trò
PATCH /users/:id/role

// Toggle trạng thái xác thực
PATCH /users/:id/status
```

### User API Service

File: `frontend/src/lib/api/user.ts`

```typescript
import { userAPI } from "@/lib/api/user";

// Lấy tất cả người dùng
const users = await userAPI.getAllUsers(page, limit);

// Lấy chi tiết
const user = await userAPI.getUserById(userId);

// Cập nhật
await userAPI.updateUser(userId, data);

// Xóa
await userAPI.deleteUser(userId);

// Cập nhật vai trò
await userAPI.updateUserRole(userId, role);

// Toggle trạng thái
await userAPI.toggleUserStatus(userId);
```

## Types

### User Interface

```typescript
interface User {
    id: string;
    email: string;
    userName: string;
    firstName: string;
    lastName: string;
    country: string;
    role: string;
    isVerified: boolean;
    lastLogin: string;
    createdAt: string;
}
```

## Styling

Sử dụng Tailwind CSS và shadcn/ui components:

- `Card`: Containers cho các sections
- `Table`: Hiển thị danh sách
- `Badge`: Hiển thị role và status
- `Dialog`: Modal forms
- `Avatar`: Hiển thị avatar người dùng
- `Tabs`: Tabs cho trang chi tiết

## Responsive Design

### Mobile (< 768px)

- Cards thống kê xếp dọc
- Table scroll ngang
- Dialog full screen

### Tablet (768px - 1024px)

- 2 columns cho stats
- Table đầy đủ
- Dialog centered

### Desktop (> 1024px)

- 4 columns cho stats
- Full layout
- Dialog max width

## Permissions

Trang này yêu cầu quyền **ADMIN** để truy cập.

### Middleware check

```typescript
// middleware.ts
if (pathname.startsWith("/admin/users")) {
    if (user.role !== "ADMIN") {
        return redirect("/403");
    }
}
```

## Best Practices

### 1. Error Handling

```typescript
try {
    await userAPI.deleteUser(userId);
    toast({ title: "Thành công" });
} catch (error) {
    toast({
        title: "Lỗi",
        variant: "destructive",
    });
}
```

### 2. Loading States

```typescript
const [loading, setLoading] = useState(true);

// Show loading spinner
{loading && <LoadingSpinner />}
```

### 3. Confirmation Dialogs

Luôn hiển thị dialog xác nhận cho các thao tác quan trọng:

- Xóa người dùng
- Thay đổi vai trò thành admin
- Khóa tài khoản

### 4. Toast Notifications

Hiển thị thông báo cho mọi thao tác:

- Thành công (success)
- Lỗi (destructive)
- Cảnh báo (warning)

## Testing

### Unit Tests

```typescript
// Test component rendering
describe("UsersPage", () => {
    it("should render user list", () => {
        // Test implementation
    });
});
```

### Integration Tests

```typescript
// Test API integration
describe("User API", () => {
    it("should fetch users", async () => {
        const users = await userAPI.getAllUsers();
        expect(users).toBeDefined();
    });
});
```

## Future Enhancements

### Planned Features

1. **Bulk Operations**
    - Xóa nhiều người dùng cùng lúc
    - Gửi email hàng loạt
    - Import/Export Excel

2. **Advanced Filters**
    - Filter theo ngày tạo
    - Filter theo ngày đăng nhập cuối
    - Filter theo quốc gia

3. **Activity Logs**
    - Chi tiết lịch sử hoạt động
    - Thống kê theo thời gian
    - Real-time updates

4. **User Analytics**
    - Biểu đồ tăng trưởng người dùng
    - Phân tích hành vi
    - Retention metrics

5. **Email Integration**
    - Gửi email xác thực
    - Reset password
    - Thông báo quan trọng

6. **Two-Factor Authentication**
    - Bật/tắt 2FA
    - Quản lý backup codes
    - Device management

## Troubleshooting

### Lỗi thường gặp

#### 1. Không load được danh sách người dùng

**Nguyên nhân**: API endpoint không hoạt động

**Giải pháp**:

- Kiểm tra API server đã chạy
- Verify token authentication
- Check CORS settings

#### 2. Dialog không mở

**Nguyên nhân**: State management issue

**Giải pháp**:

```typescript
// Ensure state is properly initialized
const [isDialogOpen, setIsDialogOpen] = useState(false);
```

#### 3. Filter không hoạt động

**Nguyên nhân**: useEffect dependencies

**Giải pháp**:

```typescript
useEffect(() => {
    // Filter logic
}, [searchQuery, roleFilter, statusFilter, users]);
```

## Support

Nếu gặp vấn đề, vui lòng:

1. Kiểm tra console logs
2. Verify API responses
3. Check network tab
4. Contact development team

## License

MIT License - ECommerce Project

# Hướng dẫn tích hợp API cho trang quản lý người dùng

## Cập nhật file `page.tsx` để sử dụng API thực

### 1. Import API service

```typescript
import { userAPI } from "@/lib/api/user";
```

### 2. Cập nhật hàm `fetchUsers`

Thay thế mock data bằng API call thực:

```typescript
const fetchUsers = async () => {
    setLoading(true);
    try {
        // Call API với phân trang
        const response = await userAPI.getAllUsers(1, 100);
        
        // Giả sử response có cấu trúc: { data: User[], total: number }
        const usersData = response.data.map((user: any) => ({
            id: user._id,
            email: user.email,
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            country: user.country,
            role: user.role,
            isVerified: user.isVerified,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
        }));

        setUsers(usersData);
        setFilteredUsers(usersData);
    } catch (error) {
        console.error("Failed to fetch users:", error);
        toast({
            title: "Lỗi",
            description: "Không thể tải danh sách người dùng",
            variant: "destructive",
        });
    } finally {
        setLoading(false);
    }
};
```

### 3. Cập nhật hàm `confirmDeleteUser`

```typescript
const confirmDeleteUser = async () => {
    if (!selectedUser) return;

    try {
        // Call API để xóa người dùng
        await userAPI.deleteUser(selectedUser.id);
        
        toast({
            title: "Thành công",
            description: `Đã xóa người dùng ${selectedUser.userName}`,
        });
        
        // Refresh danh sách
        await fetchUsers();
        setIsDeleteDialogOpen(false);
    } catch (error) {
        console.error("Failed to delete user:", error);
        toast({
            title: "Lỗi",
            description: "Không thể xóa người dùng",
            variant: "destructive",
        });
    }
};
```

### 4. Cập nhật hàm `handleToggleUserStatus`

```typescript
const handleToggleUserStatus = async (userId: string) => {
    try {
        // Call API để toggle status
        await userAPI.toggleUserStatus(userId);
        
        // Cập nhật state local
        setUsers(
            users.map((u) =>
                u.id === userId ? { ...u, isVerified: !u.isVerified } : u
            )
        );
        
        toast({
            title: "Thành công",
            description: "Đã cập nhật trạng thái người dùng",
        });
    } catch (error) {
        console.error("Failed to toggle user status:", error);
        toast({
            title: "Lỗi",
            description: "Không thể cập nhật trạng thái",
            variant: "destructive",
        });
    }
};
```

### 5. Cập nhật hàm `handleChangeRole`

```typescript
const handleChangeRole = async (userId: string, newRole: string) => {
    try {
        // Call API để thay đổi vai trò
        await userAPI.updateUserRole(userId, newRole);
        
        // Cập nhật state local
        setUsers(
            users.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        
        toast({
            title: "Thành công",
            description: "Đã cập nhật vai trò người dùng",
        });
    } catch (error) {
        console.error("Failed to update user role:", error);
        toast({
            title: "Lỗi",
            description: "Không thể cập nhật vai trò",
            variant: "destructive",
        });
    }
};
```

## Cập nhật Backend API (Node.js)

### 1. Thêm các endpoint còn thiếu trong `userController.js`

```javascript
// Get user by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Don't send password
        const { password, ...userWithoutPassword } = user.toObject();
        
        res.status(200).json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update user
const updateUser = async (req, res) => {
    try {
        const { firstName, lastName, email, country } = req.body;
        
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { firstName, lastName, email, country },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { password, ...userWithoutPassword } = user.toObject();
        res.status(200).json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update user role
const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        
        // Validate role
        if (!['user', 'admin', 'moderator'].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Role updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Toggle user verification status
const toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.isVerified = !user.isVerified;
        await user.save();

        res.status(200).json({ 
            message: "Status updated successfully", 
            isVerified: user.isVerified 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllUsers,
    getUsersByPage,
    getUserById,
    updateUser,
    deleteUser,
    updateUserRole,
    toggleUserStatus,
};
```

### 2. Cập nhật routes trong `userRoute.js`

```javascript
const express = require('express');
const {
    getAllUsers,
    getUsersByPage,
    getUserById,
    updateUser,
    deleteUser,
    updateUserRole,
    toggleUserStatus,
} = require('../controllers/userController');
const { verifyToken } = require('../middleware/verifyToken');
const { checkAdmin } = require('../middleware/checkAdmin');

const router = express.Router();

// Admin routes - require authentication and admin role
router.get('/all', verifyToken, checkAdmin, getAllUsers);
router.get('/page', verifyToken, checkAdmin, getUsersByPage);
router.get('/:id', verifyToken, checkAdmin, getUserById);
router.put('/:id', verifyToken, checkAdmin, updateUser);
router.delete('/:id', verifyToken, checkAdmin, deleteUser);
router.patch('/:id/role', verifyToken, checkAdmin, updateUserRole);
router.patch('/:id/status', verifyToken, checkAdmin, toggleUserStatus);

module.exports = router;
```

## Cập nhật Dialog tạo người dùng

### File: `create-user-dialog.tsx`

```typescript
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        // Call API để tạo người dùng
        await apiClient.post('/auth/register', formData);

        toast({
            title: "Thành công",
            description: "Đã tạo người dùng mới thành công",
        });

        // Reset form
        setFormData({
            firstName: "",
            lastName: "",
            userName: "",
            email: "",
            country: "",
            password: "",
            role: "user",
        });

        onUserCreated();
        onOpenChange(false);
    } catch (error) {
        console.error("Failed to create user:", error);
        toast({
            title: "Lỗi",
            description: "Không thể tạo người dùng mới",
            variant: "destructive",
        });
    } finally {
        setLoading(false);
    }
};
```

## Cập nhật trang chi tiết người dùng

### File: `[id]/page.tsx`

```typescript
const fetchUserDetail = async () => {
    setLoading(true);
    try {
        // Call API để lấy chi tiết người dùng
        const response = await userAPI.getUserById(userId);
        
        const userData = {
            id: response.data._id,
            email: response.data.email,
            userName: response.data.userName,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            country: response.data.country,
            role: response.data.role,
            isVerified: response.data.isVerified,
            lastLogin: response.data.lastLogin,
            createdAt: response.data.createdAt,
        };
        
        setUser(userData);
    } catch (error) {
        console.error("Failed to fetch user detail:", error);
        toast({
            title: "Lỗi",
            description: "Không thể tải thông tin người dùng",
            variant: "destructive",
        });
    } finally {
        setLoading(false);
    }
};
```

## Environment Variables

Đảm bảo file `.env.local` có cấu hình đúng:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Testing API Integration

### 1. Test với Postman/Thunder Client

```bash
# Get all users
GET http://localhost:5000/api/users/all
Authorization: Bearer YOUR_TOKEN

# Get user by ID
GET http://localhost:5000/api/users/:id
Authorization: Bearer YOUR_TOKEN

# Update user
PUT http://localhost:5000/api/users/:id
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com"
}

# Delete user
DELETE http://localhost:5000/api/users/:id
Authorization: Bearer YOUR_TOKEN

# Update role
PATCH http://localhost:5000/api/users/:id/role
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "role": "admin"
}

# Toggle status
PATCH http://localhost:5000/api/users/:id/status
Authorization: Bearer YOUR_TOKEN
```

### 2. Test Frontend Integration

1. Start backend server:
```bash
cd server
npm start
```

2. Start frontend:
```bash
cd frontend
npm run dev
```

3. Navigate to: `http://localhost:3000/admin/users`

## Error Handling

### Common Errors

#### 401 Unauthorized
```typescript
// Ensure token is valid
const token = TokenService.getAccessToken();
if (!token) {
    router.push('/login');
}
```

#### 403 Forbidden
```typescript
// Check admin role
if (user.role !== 'admin') {
    router.push('/403');
}
```

#### Network Error
```typescript
try {
    await userAPI.getAllUsers();
} catch (error) {
    if (axios.isAxiosError(error)) {
        if (!error.response) {
            toast({
                title: "Lỗi mạng",
                description: "Không thể kết nối đến server",
                variant: "destructive",
            });
        }
    }
}
```

## Next Steps

1. Implement pagination cho danh sách người dùng
2. Add real-time updates với WebSocket
3. Implement bulk operations
4. Add user activity logs
5. Integrate email service
6. Add user analytics dashboard

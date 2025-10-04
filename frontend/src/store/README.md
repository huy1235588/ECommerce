# 🔄 Redux Store Tối Ưu - My Digital Collection

## 📁 Cấu Trúc Thư Mục Mới

```
src/store/
├── api/                    # RTK Query API definitions
│   ├── base-api.ts        # Base API configuration
│   ├── auth-api.ts        # Authentication endpoints
│   ├── collections-api.ts # Collections endpoints
│   └── index.ts           # Export all APIs
├── slices/                # Redux slices
│   ├── auth-slice.ts      # Auth state management
│   └── index.ts           # Export all slices
├── hooks/                 # Custom hooks
│   ├── use-auth.ts        # Auth hook with RTK Query
│   └── index.ts           # Export all hooks
├── middleware/            # Custom middleware
└── index.ts              # Store configuration
```

## ✨ Tính Năng Đã Tối Ưu

### 1. RTK Query Integration

- ✅ Thay thế axios bằng RTK Query
- ✅ Automatic caching và invalidation
- ✅ Optimistic updates
- ✅ Automatic loading states
- ✅ Error handling tự động

### 2. Redux Persist

- ✅ Lưu trữ auth state vào localStorage
- ✅ Tự động restore state khi reload
- ✅ Selective persistence (chỉ lưu fields cần thiết)

### 3. Type Safety

- ✅ Fully typed với TypeScript
- ✅ Type-safe hooks
- ✅ Inferred return types

### 4. Performance

- ✅ Memoized selectors
- ✅ Normalized state structure
- ✅ Efficient re-renders

## 🚀 Cách Sử Dụng

### 1. Authentication

```typescript
import { useAuth } from "@/store/hooks/use-auth";

function LoginComponent() {
    const { login, isLoginLoading, error, clearError } = useAuth();

    const handleLogin = async credentials => {
        try {
            await login(credentials);
            // Auto redirect or show success
        } catch (error) {
            // Error handling
        }
    };
}
```

### 2. Collections API

```typescript
import {
    useGetCollectionsQuery,
    useCreateCollectionMutation,
} from "@/store/api/collections-api";

function CollectionsPage() {
    // Automatic loading, caching, và error handling
    const { data, isLoading, error } = useGetCollectionsQuery({
        page: 1,
        limit: 10,
    });

    const [createCollection] = useCreateCollectionMutation();
}
```

### 3. Auth Context (Simplified)

```typescript
import { useAuthContext } from '@/providers/auth-provider';

function UserProfile() {
    const { user, isAuthenticated, logout } = useAuthContext();

    return (
        <div>
            {isAuthenticated ? (
                <div>Welcome {user?.username}</div>
            ) : (
                <div>Please login</div>
            )}
        </div>
    );
}
```

## 🎯 So Sánh Trước và Sau

### Trước (Axios + Manual State Management)

```typescript
// Phải tự quản lý loading, error, caching
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [data, setData] = useState(null);

useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/api/collections");
            setData(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
}, []);
```

### Sau (RTK Query)

```typescript
// Tất cả được handle tự động
const { data, isLoading, error } = useGetCollectionsQuery();
```

## 📚 API Endpoints Đã Implement

### Auth API

- ✅ `useLoginMutation` - Đăng nhập
- ✅ `useRegisterMutation` - Đăng ký
- ✅ `useLogoutMutation` - Đăng xuất
- ✅ `useGetProfileQuery` - Lấy profile
- ✅ `useRefreshTokenMutation` - Refresh token
- ✅ `useChangePasswordMutation` - Đổi mật khẩu
- ✅ `useForgotPasswordMutation` - Quên mật khẩu
- ✅ `useResetPasswordMutation` - Reset mật khẩu

### Collections API

- ✅ `useGetCollectionsQuery` - Lấy danh sách
- ✅ `useGetCollectionByIdQuery` - Lấy chi tiết
- ✅ `useCreateCollectionMutation` - Tạo mới
- ✅ `useUpdateCollectionMutation` - Cập nhật
- ✅ `useDeleteCollectionMutation` - Xóa
- ✅ `useGetMyCollectionsQuery` - Collections của user

## 🔧 Configuration

### Store Setup

```typescript
// Đã tích hợp:
// - RTK Query middleware
// - Redux Persist
// - DevTools
// - Setup listeners cho refetch on focus/reconnect
```

### Base API Configuration

```typescript
// Features:
// - Automatic token injection
// - Error handling với auto-logout
// - Retry logic
// - Request/Response interceptors
```

## 🎨 Best Practices Đã Implement

1. **Separation of Concerns**: API logic tách biệt khỏi UI logic
2. **Error Boundaries**: Centralized error handling
3. **Loading States**: Automatic loading indicators
4. **Cache Management**: Smart invalidation strategies
5. **Type Safety**: Full TypeScript integration
6. **Performance**: Optimized re-renders và memory usage

## 🚀 Next Steps

Để tiếp tục mở rộng, bạn có thể:

1. **Thêm APIs khác**: Items, Users, Comments, etc.
2. **Implement Offline Support**: RTK Query với persistence
3. **Add Middleware**: Logging, analytics, etc.
4. **Optimize Bundle**: Code splitting cho API slices
5. **Testing**: Unit tests cho hooks và slices

## 📝 Migration Guide

Để migrate từ code cũ:

1. Thay thế `axios` calls bằng RTK Query hooks
2. Remove manual loading/error states
3. Update components để sử dụng new hooks
4. Remove old async thunks
5. Test thoroughly

Việc tối ưu này sẽ giúp code dễ maintain hơn, performance tốt hơn, và developer experience tốt hơn!

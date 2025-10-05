# Refresh Token Flow - RTK Query

## Tổng quan

File `base-api.ts` đã được tối ưu hóa để xử lý refresh token một cách hiệu quả, đảm bảo chỉ có **một request refresh token duy nhất** được gọi tại một thời điểm, ngay cả khi có nhiều API requests đồng thời gặp lỗi 401 (Unauthorized).

## Cơ chế hoạt động

### 1. Mutex Pattern (Khóa đồng bộ)

```typescript
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
}> = [];
```

- **isRefreshing**: Flag để đánh dấu có đang thực hiện refresh token hay không
- **failedQueue**: Queue chứa các request đang chờ refresh token hoàn thành

### 2. Luồng xử lý

#### Bước 1: Request gặp lỗi 401
Khi một API request nhận response với status code 401:
```typescript
if (result.error && result.error.status === 401) {
    // Token hết hạn, cần refresh
}
```

#### Bước 2: Kiểm tra đang refresh hay chưa
```typescript
if (isRefreshing) {
    // Nếu đang refresh, thêm request vào queue và chờ
    return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
    })
    .then(() => baseQuery(args, api, extraOptions))
}
```

#### Bước 3: Thực hiện refresh token (chỉ 1 lần)
```typescript
isRefreshing = true;

try {
    // 1. Lấy refresh token từ cookie hoặc localStorage
    const refreshToken = cookieUtils.get('refreshToken') || TokenService.getRefreshToken();
    
    // 2. Gọi API refresh
    const refreshResult = await baseQuery({
        url: '/auth/refresh',
        method: 'POST',
        body: { refreshToken },
    }, api, extraOptions);
    
    // 3. Lưu token mới
    TokenService.setTokens(newToken);
    
    // 4. Update Redux store
    api.dispatch(setToken(newToken));
    
    // 5. Process queue - retry các request đang chờ
    processQueue();
    
    // 6. Retry request ban đầu
    result = await baseQuery(args, api, extraOptions);
} finally {
    isRefreshing = false;
}
```

#### Bước 4: Xử lý lỗi refresh
Nếu refresh token thất bại:
```typescript
catch (error) {
    // 1. Notify tất cả request trong queue về lỗi
    processQueue(error);
    
    // 2. Clear auth state
    api.dispatch(clearAuth());
    
    // 3. Redirect về trang login
    window.location.href = '/login';
}
```

## Ưu điểm

### 1. Hiệu quả
- **Chỉ 1 request refresh token** dù có bao nhiêu API requests đồng thời gặp 401
- Giảm tải cho server
- Tránh race condition

### 2. Đồng bộ
- Tất cả requests đang chờ sẽ được retry sau khi refresh thành công
- Đảm bảo consistency của token across all requests

### 3. User Experience
- Transparent cho người dùng
- Không cần retry thủ công
- Tự động redirect khi refresh thất bại

## Ví dụ Scenario

### Scenario: 10 API requests đồng thời với token hết hạn

```
Timeline:
---------

t0: User thực hiện 10 actions → 10 API requests được gọi
t1: Cả 10 requests đều nhận 401 response
t2: Request 1 set isRefreshing = true, bắt đầu refresh
t3: Request 2-10 thấy isRefreshing = true → thêm vào failedQueue
t4: Refresh token thành công → processQueue() được gọi
t5: Request 1 retry với token mới
t6: Request 2-10 được resolve → retry với token mới
t7: Tất cả 10 requests hoàn thành thành công

Kết quả: Chỉ 1 refresh token request được gọi!
```

## Token Storage Priority

Refresh token được lấy theo thứ tự ưu tiên:
1. **Cookie** (bảo mật hơn, HttpOnly)
2. **localStorage** (fallback)

```typescript
const refreshToken = cookieUtils.get('refreshToken') || TokenService.getRefreshToken();
```

## Error Handling

### 1. Không có refresh token
```typescript
if (!refreshToken) {
    throw new Error('No refresh token available');
    // → Logout và redirect
}
```

### 2. Refresh API thất bại
```typescript
if (!refreshResult.data) {
    throw new Error('Refresh token failed');
    // → Clear queue, logout, redirect
}
```

### 3. Network errors
- Tất cả errors trong quá trình refresh đều được catch
- Queue được clear với error
- User được logout và redirect về login

## Best Practices

### 1. Token Expiration
- Access token nên có thời gian ngắn (15-30 phút)
- Refresh token có thời gian dài hơn (7-30 ngày)

### 2. Security
- Lưu refresh token trong HttpOnly cookie nếu có thể
- Clear tokens khi logout
- Validate token expiration ở cả client và server

### 3. Testing
Test các scenarios:
- Single request với 401
- Multiple concurrent requests với 401
- Refresh token hết hạn
- Network failure khi refresh
- Concurrent refresh calls

## Migration Guide

### Từ code cũ:
```typescript
// Code cũ - không có mutex
const baseQueryWithReauth = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);
    
    if (result.error && result.error.status === 401) {
        // Logout ngay lập tức
        api.dispatch(clearAuth());
        window.location.href = '/login';
    }
    
    return result;
};
```

### Sang code mới:
```typescript
// Code mới - có mutex và retry logic
const baseQueryWithReauth = async (args, api, extraOptions) => {
    // Check nếu đang refresh → queue
    if (isRefreshing) {
        return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
        }).then(() => baseQuery(args, api, extraOptions));
    }
    
    // ... refresh logic với mutex
};
```

## Monitoring & Debugging

### Console Logs
```typescript
console.log('Token expired, attempting refresh...');
console.error('Refresh token error:', error);
```

### Redux DevTools
- Track `setToken` action khi refresh thành công
- Track `clearAuth` action khi refresh thất bại

### Network Tab
- Xem chỉ có 1 request `/auth/refresh` khi nhiều requests 401
- Kiểm tra timing của retry requests

## Tham khảo

- [RTK Query - Re-authorization](https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#automatic-re-authorization-by-extending-fetchbasequery)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

# User Service Flows

## 📋 Tổng quan

Tài liệu này mô tả các flow hoạt động chính của User Service, bao gồm authentication, registration, và các user operations quan trọng.

---

## 🔐 1. User Registration Flow

### Mô tả

Flow đăng ký tài khoản mới cho người dùng.

### Sequence Diagram

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant APIGateway as API Gateway
    participant UserService as User Service
    participant Database
    participant EmailService as Email Service
    participant EventBus as Event Bus (Kafka)

    User->>Frontend: Điền form đăng ký
    Frontend->>Frontend: Validate form (client-side)
    
    Frontend->>APIGateway: POST /v1/auth/register<br/>{email, username, password, ...}
    APIGateway->>UserService: Forward request với trace_id
    
    UserService->>UserService: Validate input data
    UserService->>Database: Check email exists
    
    alt Email already exists
        Database-->>UserService: Email found
        UserService-->>APIGateway: 409 RESOURCE_ALREADY_EXISTS
        APIGateway-->>Frontend: Error response
        Frontend-->>User: Show error: Email đã tồn tại
    else Email available
        Database-->>UserService: Email not found
        
        UserService->>UserService: Hash password (BCrypt cost 12)
        UserService->>UserService: Generate user ID (UUID)
        
        UserService->>Database: BEGIN TRANSACTION
        UserService->>Database: INSERT INTO users
        UserService->>Database: INSERT INTO user_profiles
        UserService->>Database: INSERT INTO email_verification_tokens
        UserService->>Database: COMMIT TRANSACTION
        
        Database-->>UserService: Success
        
        UserService->>EventBus: Publish UserCreatedEvent<br/>{userId, email, username}
        
        par Async operations
            UserService->>EmailService: Send verification email<br/>{email, token}
        and
            EventBus-->>Other Services: Notify user created
        end
        
        UserService-->>APIGateway: 201 Created<br/>{user, message}
        APIGateway-->>Frontend: Success response
        Frontend-->>User: Redirect to verify email page
    end
```

### Steps

1. **Client-side Validation**

    - Frontend validate form fields
    - Check password strength
    - Validate email format

2. **Server-side Validation**

    - Validate all required fields
    - Check email uniqueness
    - Check username uniqueness
    - Validate password complexity

3. **User Creation**

    - Hash password với BCrypt (cost factor 12)
    - Generate UUID cho user ID
    - Create transaction để đảm bảo consistency
    - Insert vào `users` table
    - Insert vào `user_profiles` table
    - Generate email verification token

4. **Post-Registration**
    - Publish `UserCreatedEvent` lên Kafka
    - Send verification email (async)
    - Other services listen event và react (analytics, welcome email, etc.)

### Error Scenarios

| Scenario               | HTTP Status | Error Code                | Action                          |
| ---------------------- | ----------- | ------------------------- | ------------------------------- |
| Email exists           | 409         | RESOURCE_ALREADY_EXISTS   | Show error, suggest login       |
| Username exists        | 409         | RESOURCE_ALREADY_EXISTS   | Show error, suggest another     |
| Invalid email format   | 422         | VALIDATION_INVALID_FORMAT | Show validation error           |
| Password too short     | 422         | VALIDATION_MIN_LENGTH     | Show password requirements      |
| Database error         | 500         | SERVER_DATABASE_ERROR     | Show generic error, log details |

---

## 🔓 2. User Login Flow

### Mô tả

Flow authentication cho user đã có tài khoản.

### Sequence Diagram

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant APIGateway as API Gateway
    participant UserService as User Service
    participant Database
    participant Redis
    participant EventBus as Event Bus (Kafka)

    User->>Frontend: Nhập email & password
    Frontend->>APIGateway: POST /v1/auth/login<br/>{email, password}
    APIGateway->>UserService: Forward request + IP + User-Agent
    
    UserService->>Database: SELECT user by email
    
    alt User not found
        Database-->>UserService: No user
        UserService-->>APIGateway: 401 AUTH_INVALID_CREDENTIALS
        APIGateway-->>Frontend: Error response
        Frontend-->>User: Show error: Invalid credentials
    else User found
        Database-->>UserService: User data
        
        UserService->>UserService: Check user.status
        
        alt Status = suspended
            UserService-->>APIGateway: 403 AUTH_ACCOUNT_LOCKED
            APIGateway-->>Frontend: Error response
            Frontend-->>User: Account suspended
        else Status = active
            UserService->>UserService: Compare password hash
            
            alt Password incorrect
                UserService->>Redis: Increment failed login counter
                UserService-->>APIGateway: 401 AUTH_INVALID_CREDENTIALS
                APIGateway-->>Frontend: Error response
                Frontend-->>User: Invalid credentials
            else Password correct
                UserService->>UserService: Generate JWT access token (1h)
                UserService->>UserService: Generate JWT refresh token (7d)
                UserService->>UserService: Hash refresh token (SHA-256)
                
                UserService->>Database: BEGIN TRANSACTION
                UserService->>Database: INSERT INTO refresh_tokens
                UserService->>Database: INSERT INTO user_sessions
                UserService->>Database: UPDATE users.last_login_at
                UserService->>Database: COMMIT TRANSACTION
                
                UserService->>Redis: Cache user session<br/>{userId, sessionId}
                
                UserService->>EventBus: Publish UserLoggedInEvent<br/>{userId, timestamp, ip}
                
                UserService-->>APIGateway: 200 OK<br/>{access_token, refresh_token, user}
                APIGateway-->>Frontend: Success response
                
                Frontend->>Frontend: Store tokens in memory/secure storage
                Frontend-->>User: Redirect to dashboard
            end
        end
    end
```

### Steps

1. **Credential Validation**

    - Get user by email
    - Check user exists
    - Verify account status (active/suspended)
    - Compare password hash

2. **Token Generation**

    - Generate JWT access token (expires 1 hour)
    - Generate JWT refresh token (expires 7 days)
    - Hash refresh token before storing (SHA-256)

3. **Session Management**

    - Store refresh token in database
    - Create user session record
    - Cache session in Redis for fast lookup
    - Update last_login_at timestamp

4. **Event Publishing**
    - Publish `UserLoggedInEvent` to Kafka
    - Analytics service track login patterns
    - Security service monitor suspicious logins

### Error Scenarios

| Scenario                | HTTP Status | Error Code                 | Action                    |
| ----------------------- | ----------- | -------------------------- | ------------------------- |
| User not found          | 401         | AUTH_INVALID_CREDENTIALS   | Show generic error        |
| Wrong password          | 401         | AUTH_INVALID_CREDENTIALS   | Show generic error        |
| Account suspended       | 403         | AUTH_ACCOUNT_LOCKED        | Contact support message   |
| Email not verified      | 403         | AUTH_EMAIL_NOT_VERIFIED    | Resend verification link  |
| Too many failed attempts| 429         | RATE_LIMIT_EXCEEDED        | Wait X minutes            |

---

## 🔄 3. Token Refresh Flow

### Mô tả

Flow refresh access token khi token cũ hết hạn.

### Sequence Diagram

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant APIGateway as API Gateway
    participant UserService as User Service
    participant Redis
    participant Database

    User->>Frontend: Action triggers API call
    Frontend->>APIGateway: GET /v1/users/me<br/>Authorization: Bearer {expired_token}
    APIGateway-->>Frontend: 401 AUTH_TOKEN_EXPIRED
    
    Frontend->>Frontend: Detect token expired
    Frontend->>APIGateway: POST /v1/auth/refresh<br/>{refresh_token}
    APIGateway->>UserService: Forward refresh request
    
    UserService->>UserService: Hash refresh token (SHA-256)
    UserService->>Redis: Check token in cache
    
    alt Token in cache
        Redis-->>UserService: Token valid, userId
    else Token not in cache
        UserService->>Database: SELECT from refresh_tokens<br/>WHERE token_hash = ? AND is_revoked = false
        
        alt Token invalid/revoked/expired
            Database-->>UserService: No token found
            UserService-->>APIGateway: 401 AUTH_INVALID_TOKEN
            APIGateway-->>Frontend: Error response
            Frontend-->>User: Redirect to login
        else Token valid
            Database-->>UserService: Token data + userId
            UserService->>Redis: Cache token for fast lookup
        end
    end
    
    UserService->>Database: SELECT user by userId
    Database-->>UserService: User data
    
    UserService->>UserService: Check user.status = active
    
    alt User suspended or inactive
        UserService->>Database: UPDATE refresh_tokens<br/>SET is_revoked = true
        UserService-->>APIGateway: 403 AUTH_ACCOUNT_LOCKED
        APIGateway-->>Frontend: Error response
        Frontend-->>User: Account locked message
    else User active
        UserService->>UserService: Generate new access token (1h)
        UserService->>UserService: Generate new refresh token (7d)
        UserService->>UserService: Hash new refresh token
        
        UserService->>Database: BEGIN TRANSACTION
        UserService->>Database: UPDATE old refresh_token<br/>SET is_revoked = true
        UserService->>Database: INSERT new refresh_token
        UserService->>Database: COMMIT TRANSACTION
        
        UserService->>Redis: Update cache với new tokens
        
        UserService-->>APIGateway: 200 OK<br/>{access_token, refresh_token}
        APIGateway-->>Frontend: New tokens
        
        Frontend->>Frontend: Update stored tokens
        Frontend->>APIGateway: Retry original request<br/>Authorization: Bearer {new_token}
        APIGateway-->>Frontend: Success response
        Frontend-->>User: Display data
    end
```

### Steps

1. **Token Validation**

    - Hash refresh token
    - Check in Redis cache first (performance)
    - Validate token not expired và not revoked
    - Check user still active

2. **Token Rotation**

    - Generate new access token
    - Generate new refresh token
    - Revoke old refresh token
    - Store new refresh token

3. **Cache Update**
    - Update Redis cache với new tokens
    - Remove old token from cache

### Security Notes

-   **Token Rotation**: Mỗi lần refresh tạo token mới và revoke token cũ
-   **Revoked Token Check**: Prevent replay attacks
-   **User Status Check**: Ensure user vẫn active
-   **Single Use**: Refresh token chỉ dùng 1 lần

---

## 📧 4. Email Verification Flow

### Mô tả

Flow xác thực email sau khi đăng ký.

### Sequence Diagram

```mermaid
sequenceDiagram
    actor User
    participant Email
    participant Frontend
    participant APIGateway as API Gateway
    participant UserService as User Service
    participant Database
    participant EventBus as Event Bus (Kafka)

    Note over User,EventBus: Email đã được gửi sau registration
    
    Email->>User: Email với verification link<br/>https://app.com/verify?token=xyz
    User->>Frontend: Click verification link
    
    Frontend->>APIGateway: GET /v1/auth/verify-email?token=xyz
    APIGateway->>UserService: Forward verification request
    
    UserService->>UserService: Hash token (SHA-256)
    UserService->>Database: SELECT from email_verification_tokens<br/>WHERE token_hash = ?
    
    alt Token not found or already used
        Database-->>UserService: No valid token
        UserService-->>APIGateway: 400 Invalid token
        APIGateway-->>Frontend: Error response
        Frontend-->>User: Show error: Invalid or expired link
    else Token found
        Database-->>UserService: Token data + userId
        
        UserService->>UserService: Check token.expires_at > NOW()
        
        alt Token expired
            UserService-->>APIGateway: 400 Token expired
            APIGateway-->>Frontend: Error response
            Frontend-->>User: Token expired<br/>Show "Resend email" button
        else Token valid
            UserService->>Database: BEGIN TRANSACTION
            UserService->>Database: UPDATE users<br/>SET email_verified = true<br/>WHERE id = ?
            UserService->>Database: UPDATE email_verification_tokens<br/>SET is_verified = true<br/>WHERE id = ?
            UserService->>Database: COMMIT TRANSACTION
            
            Database-->>UserService: Success
            
            UserService->>EventBus: Publish EmailVerifiedEvent<br/>{userId, email}
            
            UserService-->>APIGateway: 200 OK<br/>{success: true, message}
            APIGateway-->>Frontend: Success response
            Frontend-->>User: Email verified!<br/>Redirect to login
        end
    end
```

### Steps

1. **Token Validation**

    - Hash token từ URL
    - Lookup trong database
    - Check token chưa used
    - Check token chưa expired (24h)

2. **Email Verification**

    - Update `users.email_verified = true`
    - Mark token as used
    - Transaction để ensure consistency

3. **Event Publishing**
    - Publish `EmailVerifiedEvent`
    - Other services có thể react (welcome bonus, etc.)

### Resend Verification Email Flow

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant APIGateway as API Gateway
    participant UserService as User Service
    participant Database
    participant EmailService as Email Service

    User->>Frontend: Click "Resend verification email"
    Frontend->>APIGateway: POST /v1/auth/resend-verification
    APIGateway->>UserService: Forward request với userId
    
    UserService->>Database: SELECT user by id
    Database-->>UserService: User data
    
    alt Email already verified
        UserService-->>APIGateway: 400 Email already verified
        APIGateway-->>Frontend: Error response
        Frontend-->>User: Email already verified
    else Email not verified
        UserService->>Database: UPDATE email_verification_tokens<br/>SET is_verified = true (invalidate old)
        UserService->>UserService: Generate new verification token
        UserService->>Database: INSERT new email_verification_token
        
        UserService->>EmailService: Send verification email<br/>{email, new_token}
        
        UserService-->>APIGateway: 200 OK<br/>{message: Email sent}
        APIGateway-->>Frontend: Success response
        Frontend-->>User: Verification email sent!
    end
```

---

## 🔑 5. Password Reset Flow

### Mô tả

Flow reset password khi user quên mật khẩu.

### Sequence Diagram

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant APIGateway as API Gateway
    participant UserService as User Service
    participant Database
    participant EmailService as Email Service
    participant Email

    Note over User,Email: Step 1: Request Password Reset
    
    User->>Frontend: Click "Forgot Password"
    Frontend->>Frontend: Show email input form
    User->>Frontend: Enter email
    
    Frontend->>APIGateway: POST /v1/auth/forgot-password<br/>{email}
    APIGateway->>UserService: Forward request
    
    UserService->>Database: SELECT user by email
    
    Note over UserService: Luôn return success để tránh enumerate users
    
    alt User not found
        Database-->>UserService: No user
        UserService-->>APIGateway: 200 OK (generic message)
    else User found
        Database-->>UserService: User data
        
        UserService->>Database: UPDATE old password_reset_tokens<br/>SET is_used = true
        UserService->>UserService: Generate reset token (UUID)
        UserService->>UserService: Hash token (SHA-256)
        UserService->>Database: INSERT INTO password_reset_tokens<br/>(expires in 1 hour)
        
        UserService->>EmailService: Send reset email<br/>{email, reset_token}
    end
    
    UserService-->>APIGateway: 200 OK<br/>{message: If account exists, email sent}
    APIGateway-->>Frontend: Generic success response
    Frontend-->>User: Check your email for reset link
    
    Note over User,Email: Step 2: Reset Password
    
    EmailService->>Email: Email with reset link<br/>https://app.com/reset?token=xyz
    Email->>User: Receive email
    User->>Frontend: Click reset link
    
    Frontend->>Frontend: Show new password form
    User->>Frontend: Enter new password
    
    Frontend->>APIGateway: POST /v1/auth/reset-password<br/>{token, new_password}
    APIGateway->>UserService: Forward reset request
    
    UserService->>UserService: Hash token (SHA-256)
    UserService->>Database: SELECT from password_reset_tokens<br/>WHERE token_hash = ? AND is_used = false
    
    alt Token invalid/used/expired
        Database-->>UserService: No valid token
        UserService-->>APIGateway: 400 Invalid or expired token
        APIGateway-->>Frontend: Error response
        Frontend-->>User: Invalid link<br/>Request new reset
    else Token valid
        Database-->>UserService: Token data + userId
        
        UserService->>UserService: Hash new password (BCrypt)
        
        UserService->>Database: BEGIN TRANSACTION
        UserService->>Database: UPDATE users<br/>SET password_hash = ?<br/>WHERE id = ?
        UserService->>Database: UPDATE password_reset_tokens<br/>SET is_used = true
        UserService->>Database: UPDATE refresh_tokens<br/>SET is_revoked = true<br/>WHERE user_id = ?
        UserService->>Database: DELETE FROM user_sessions<br/>WHERE user_id = ?
        UserService->>Database: COMMIT TRANSACTION
        
        Database-->>UserService: Success
        
        UserService-->>APIGateway: 200 OK<br/>{message: Password reset successful}
        APIGateway-->>Frontend: Success response
        Frontend-->>User: Password reset!<br/>Redirect to login
    end
```

### Steps

#### Step 1: Request Reset

1. User nhập email
2. Generate reset token (UUID)
3. Hash token và store trong database (expires 1h)
4. Send email với reset link
5. Return generic success message (security: tránh enumerate users)

#### Step 2: Reset Password

1. User click link từ email
2. Validate reset token
3. Check token not expired và not used
4. Hash new password
5. Update password trong database
6. Mark token as used
7. **Security**: Revoke tất cả refresh tokens và sessions
8. User phải login lại

### Security Considerations

-   Token hashed trước khi store
-   Token single-use (is_used flag)
-   Token expires sau 1 giờ
-   Invalidate old tokens khi request mới
-   Generic response để prevent user enumeration
-   Revoke all sessions sau password reset

---

## 👤 6. Update Profile Flow

### Mô tả

Flow cập nhật thông tin profile của user.

### Sequence Diagram

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant APIGateway as API Gateway
    participant UserService as User Service
    participant Database
    participant FileService as File Service (CDN)
    participant EventBus as Event Bus (Kafka)

    User->>Frontend: Edit profile form
    User->>Frontend: Submit changes
    
    Frontend->>Frontend: Validate form data
    
    alt Upload avatar
        Frontend->>APIGateway: POST /v1/users/me/avatar<br/>(multipart/form-data)
        APIGateway->>UserService: Forward file upload
        
        UserService->>UserService: Validate file<br/>(size, format)
        
        alt Invalid file
            UserService-->>APIGateway: 400 Invalid file format
            APIGateway-->>Frontend: Error response
            Frontend-->>User: Show error
        else Valid file
            UserService->>FileService: Upload to CDN<br/>{file, userId}
            FileService-->>UserService: CDN URL
            
            UserService->>Database: UPDATE user_profiles<br/>SET avatar_url = ?
            Database-->>UserService: Success
            
            UserService-->>APIGateway: 200 OK<br/>{avatar_url}
            APIGateway-->>Frontend: New avatar URL
        end
    end
    
    Frontend->>APIGateway: PATCH /v1/users/me/profile<br/>{first_name, last_name, bio, ...}
    APIGateway->>UserService: Forward update request + userId from JWT
    
    UserService->>UserService: Validate input data
    
    alt Validation failed
        UserService-->>APIGateway: 422 VALIDATION_ERROR<br/>{details}
        APIGateway-->>Frontend: Validation errors
        Frontend-->>User: Show field errors
    else Validation passed
        UserService->>Database: UPDATE user_profiles<br/>SET ... WHERE user_id = ?
        Database-->>UserService: Success
        
        UserService->>Database: SELECT updated profile
        Database-->>UserService: Profile data
        
        UserService->>EventBus: Publish ProfileUpdatedEvent<br/>{userId, changes}
        
        UserService-->>APIGateway: 200 OK<br/>{updated_profile}
        APIGateway-->>Frontend: Updated profile
        Frontend-->>User: Profile updated successfully!
    end
```

### Steps

1. **File Upload (if avatar changed)**

    - Validate file format (JPEG/PNG)
    - Validate file size (max 5MB)
    - Upload to CDN/S3
    - Get CDN URL
    - Update avatar_url trong database

2. **Profile Update**

    - Validate input fields
    - Check user ownership (JWT userId)
    - Update user_profiles table
    - Publish ProfileUpdatedEvent

3. **Event Publishing**
    - Other services có thể sync profile data nếu cần

---

## 🚪 7. Logout Flow

### Mô tả

Flow logout và invalidate user session.

### Sequence Diagram

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant APIGateway as API Gateway
    participant UserService as User Service
    participant Database
    participant Redis

    User->>Frontend: Click logout
    Frontend->>APIGateway: POST /v1/auth/logout<br/>Authorization: Bearer {token}
    APIGateway->>UserService: Forward logout request + userId from JWT
    
    UserService->>UserService: Extract userId from JWT
    UserService->>UserService: Hash current refresh token
    
    UserService->>Database: BEGIN TRANSACTION
    UserService->>Database: UPDATE refresh_tokens<br/>SET is_revoked = true<br/>WHERE user_id = ?
    UserService->>Database: DELETE FROM user_sessions<br/>WHERE user_id = ?
    UserService->>Database: COMMIT TRANSACTION
    
    Database-->>UserService: Success
    
    UserService->>Redis: DELETE user session cache
    
    UserService-->>APIGateway: 200 OK<br/>{message: Logged out}
    APIGateway-->>Frontend: Success response
    
    Frontend->>Frontend: Clear tokens from storage
    Frontend->>Frontend: Clear Redux state
    Frontend-->>User: Redirect to login page
```

### Steps

1. **Session Invalidation**

    - Extract userId từ JWT
    - Revoke tất cả refresh tokens của user
    - Delete tất cả user sessions
    - Clear Redis cache

2. **Client Cleanup**
    - Clear tokens từ local storage/memory
    - Clear application state
    - Redirect về login page

### Logout All Devices

User có thể logout tất cả devices khác:

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant UserService as User Service
    participant Database

    User->>Frontend: Click "Logout all devices"
    Frontend->>UserService: POST /v1/auth/logout-all
    
    UserService->>Database: UPDATE refresh_tokens<br/>SET is_revoked = true<br/>WHERE user_id = ?
    UserService->>Database: DELETE FROM user_sessions<br/>WHERE user_id = ?
    
    UserService-->>Frontend: Success
    Frontend-->>User: All devices logged out
```

---

## 📚 Related Documentation

-   [[user-service-api]] - User Service API specification
-   [[user-service-db]] - User Service database schema
-   [[api-standards]] - API design standards
-   [[error-handling]] - Error handling standards
-   [[authentication-design]] - JWT authentication design

---

**Version**: 1.0.0  
**Last Updated**: 2025-10-03  
**Maintained by**: Backend Team

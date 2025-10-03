# Notification Service Flows

## 📋 Tổng quan

Tài liệu này mô tả các flow hoạt động chính của Notification Service, bao gồm event-driven notification creation, email processing, push notifications, và preference management.

**Real-time Technology**: Sử dụng **SSE (Server-Sent Events)** thay vì WebSocket vì:

-   ✅ One-way communication đủ cho notifications (server → client)
-   ✅ Tự động reconnect khi mất kết nối
-   ✅ Đơn giản hơn, ít overhead hơn
-   ✅ Firewall friendly (HTTP standard)
-   ✅ Hoạt động tốt với HTTP/2

---

## 📧 1. Event-Driven Notification Flow

### Mô tả

Flow tự động tạo notifications dựa trên events từ các services khác thông qua Kafka.

### Sequence Diagram

```mermaid
sequenceDiagram
    participant UserService as User Service
    participant OrderService as Order Service
    participant Kafka as Kafka Event Bus
    participant NotificationService as Notification Service
    participant Database as Notification DB
    participant EmailQueue as Email Queue
    participant EmailWorker as Email Worker
    participant SMTPServer as SMTP Server
    participant User

    Note over UserService,User: Example: Order Placed Event

    OrderService->>Kafka: Publish OrderPlacedEvent<br/>{orderId, userId, amount, items}

    Kafka->>NotificationService: Consume OrderPlacedEvent

    NotificationService->>Database: Get user preferences<br/>SELECT FROM notification_preferences

    alt Preferences allow ORDER notifications
        Database-->>NotificationService: Preferences data

        NotificationService->>Database: Get template<br/>SELECT FROM notification_templates<br/>WHERE name = 'order-confirmation'
        Database-->>NotificationService: Template data

        NotificationService->>NotificationService: Render template<br/>Replace {{variables}} with actual data

        par Create notifications
            alt Email enabled
                NotificationService->>Database: INSERT INTO email_queue<br/>{to_email, subject, body}
                NotificationService->>Database: INSERT INTO notifications<br/>{type: EMAIL, ...}
            end

            alt In-app enabled
                NotificationService->>Database: INSERT INTO notifications<br/>{type: IN_APP, ...}
                NotificationService->>NotificationService: Publish SSE event
                NotificationService-->>User: Real-time notification (SSE)
            end

            alt Push enabled
                NotificationService->>Database: SELECT FROM push_subscriptions<br/>WHERE user_id = ? AND is_active = true
                Database-->>NotificationService: Push subscription endpoints
                NotificationService->>NotificationService: Send Web Push API
                NotificationService-->>User: Browser push notification
                NotificationService->>Database: INSERT INTO notifications<br/>{type: PUSH, ...}
            end
        end

        Note over EmailWorker: Background Email Processing

        EmailWorker->>Database: SELECT FROM email_queue<br/>WHERE status = 'PENDING'<br/>ORDER BY priority, created_at<br/>LIMIT 100
        Database-->>EmailWorker: Email batch

        loop For each email
            EmailWorker->>Database: UPDATE email_queue<br/>SET status = 'SENDING'

            EmailWorker->>SMTPServer: Send email

            alt Email sent successfully
                SMTPServer-->>EmailWorker: 250 OK
                EmailWorker->>Database: UPDATE email_queue<br/>SET status = 'SENT', sent_at = NOW()
                EmailWorker->>Database: UPDATE notifications<br/>SET sent_at = NOW()<br/>WHERE type = 'EMAIL'
            else Email failed
                SMTPServer-->>EmailWorker: 5xx Error
                EmailWorker->>Database: UPDATE email_queue<br/>SET retry_count = retry_count + 1<br/>status = CASE<br/>  WHEN retry_count < 3 THEN 'PENDING'<br/>  ELSE 'FAILED'<br/>END
            end
        end
    else Preferences disabled ORDER notifications
        Database-->>NotificationService: Preferences: disabled
        Note over NotificationService: Skip notification creation
    end
```

### Steps

1. **Event Publishing**

    - Service khác (Order, Payment, User, etc.) publish event lên Kafka
    - Event chứa tất cả data cần thiết cho notification

2. **Event Consumption**

    - Notification Service consume event từ Kafka
    - Parse event data

3. **Preference Check**

    - Load user notification preferences
    - Check nếu user cho phép notification type và category này
    - SYSTEM và ACCOUNT security notifications bypass preferences

4. **Template Rendering**

    - Load notification template từ database
    - Replace template variables với actual event data
    - Generate subject và body

5. **Multi-Channel Notification Creation**

    - **Email**: Add to email_queue cho async processing
    - **In-App**: Create notification record, send SSE event
    - **Push**: Send browser push notification
    - Track trong notifications table

6. **Email Queue Processing** (Background Job)
    - Worker process email queue với priority
    - Retry logic cho failed emails
    - Update status và timestamps

### Event Types & Corresponding Notifications

| Event                | Category | Template           | Channels            |
| -------------------- | -------- | ------------------ | ------------------- |
| UserCreatedEvent     | ACCOUNT  | welcome-email      | EMAIL, IN_APP       |
| OrderPlacedEvent     | ORDER    | order-confirmation | EMAIL, IN_APP, PUSH |
| PaymentSuccessEvent  | PAYMENT  | payment-receipt    | EMAIL, IN_APP       |
| PaymentFailedEvent   | PAYMENT  | payment-failed     | EMAIL, IN_APP       |
| GamePurchasedEvent   | GAME     | game-purchase      | EMAIL, IN_APP       |
| OrderShippedEvent    | ORDER    | order-shipped      | EMAIL, IN_APP, PUSH |
| OrderDeliveredEvent  | ORDER    | order-delivered    | EMAIL, IN_APP       |
| PasswordChangedEvent | ACCOUNT  | password-changed   | EMAIL               |
| LoginFromNewDevice   | ACCOUNT  | new-device-login   | EMAIL               |

---

## 🔔 2. Real-time In-App Notification Flow

### Mô tả

Flow hiển thị real-time notifications trong application UI qua **SSE (Server-Sent Events)**. SSE phù hợp hơn WebSocket vì:

-   Chỉ cần one-way communication (server → client)
-   Tự động reconnect khi mất connection
-   Đơn giản hơn, ít overhead hơn
-   Firewall friendly (sử dụng HTTP standard)

### Sequence Diagram

```mermaid
sequenceDiagram
    actor User
    participant Frontend as Frontend (Browser)
    participant SSE as SSE Endpoint
    participant NotificationService as Notification Service
    participant Database
    participant Kafka as Kafka Event Bus

    Note over User,Kafka: User logs in and connects

    User->>Frontend: Login successfully
    Frontend->>Frontend: Get JWT token

    Frontend->>SSE: Connect SSE<br/>GET /notifications/stream<br/>Authorization: Bearer {jwt}

    SSE->>NotificationService: Validate JWT token

    alt Token valid
        NotificationService-->>SSE: Authentication OK
        SSE-->>Frontend: Connection established<br/>Content-Type: text/event-stream

        SSE->>Database: Get unread notifications<br/>SELECT FROM notifications<br/>WHERE user_id = ? AND is_read = false
        Database-->>SSE: Unread notifications

        SSE-->>Frontend: event: initial<br/>data: {unread_count: 5, notifications: [...]}

        Frontend->>Frontend: Display notification badge<br/>Show count: 5 unread

        Note over SSE,Frontend: Keep-alive heartbeat

        loop Every 30 seconds
            SSE-->>Frontend: event: heartbeat<br/>data: {timestamp: "..."}
        end

        Note over Kafka,Frontend: New notification event occurs

        Kafka->>NotificationService: OrderPlacedEvent
        NotificationService->>Database: INSERT INTO notifications
        Database-->>NotificationService: Notification created

        NotificationService->>SSE: Push to user SSE connection<br/>{userId, notification}

        SSE-->>Frontend: event: notification<br/>data: {<br/>  id: "uuid",<br/>  title: "Order Confirmed",<br/>  message: "Your order has been confirmed!",<br/>  category: "ORDER"<br/>}

        Frontend->>Frontend: Show toast notification<br/>"Your order has been confirmed!"
        Frontend->>Frontend: Update badge count: 6 unread
        Frontend->>Frontend: Add to notification list

        User->>Frontend: Click notification
        Frontend->>NotificationService: PATCH /notifications/{id}/read
        NotificationService->>Database: UPDATE notifications<br/>SET is_read = true, read_at = NOW()
        Database-->>NotificationService: Updated
        NotificationService-->>Frontend: Success

        Frontend->>Frontend: Mark as read in UI
        Frontend->>Frontend: Update badge count: 5 unread

        User->>Frontend: Navigate to order details

    else Token invalid
        NotificationService-->>SSE: Authentication failed<br/>HTTP 401
        SSE-->>Frontend: Connection rejected
        Frontend->>Frontend: Retry connection or re-login
    end

    Note over User,Frontend: User logs out or closes browser

    User->>Frontend: Logout / Close browser
    Frontend->>Frontend: Close EventSource connection
    SSE->>NotificationService: Remove from active connections
```

### Steps

1. **SSE Connection**

    - Frontend tạo EventSource connection sau khi login
    - Send JWT token trong Authorization header
    - Server validate token và establish SSE stream

2. **Initial Sync**

    - Load unread notifications từ database
    - Send initial event với unread count và notifications
    - Display notification badge và list

3. **Keep-Alive Heartbeat**

    - Server gửi heartbeat event mỗi 30 giây
    - Maintain connection và detect disconnection
    - Browser tự động reconnect nếu connection lost

4. **Real-time Push**

    - Khi notification mới được tạo, push qua SSE
    - Client receive event và display toast
    - Update UI (badge count, notification list)

5. **Mark as Read**

    - User click notification
    - Send PATCH request để mark as read
    - Update UI optimistically

6. **Connection Management**
    - Browser tự động reconnect khi disconnect
    - Resume from last known state
    - Close connection on logout

### SSE Event Types

```javascript
// Frontend EventSource implementation
const eventSource = new EventSource("/v1/notifications/stream", {
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

// Initial data event
eventSource.addEventListener("initial", (e) => {
    const data = JSON.parse(e.data);
    updateBadgeCount(data.unread_count);
    displayNotifications(data.notifications);
});

// New notification event
eventSource.addEventListener("notification", (e) => {
    const notification = JSON.parse(e.data);
    showToast(notification);
    updateBadgeCount();
    addToNotificationList(notification);
});

// Heartbeat event (keep connection alive)
eventSource.addEventListener("heartbeat", (e) => {
    console.log("Connection alive:", e.data);
});

// Error handling (auto-reconnect by browser)
eventSource.onerror = (error) => {
    console.error("SSE Error:", error);
    // Browser will automatically reconnect
};
```

### Backend SSE Response Format

```
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive

event: initial
data: {"unread_count": 5, "notifications": [...]}

event: heartbeat
data: {"timestamp": "2025-10-03T12:00:00Z"}

event: notification
data: {"id": "uuid", "title": "Order Confirmed", "message": "...", "category": "ORDER"}

event: notification
data: {"id": "uuid2", "title": "Payment Successful", "message": "...", "category": "PAYMENT"}
```

---

## 📩 3. Email Queue Processing Flow

### Mô tả

Background worker process email queue với retry logic và priority.

### Sequence Diagram

```mermaid
sequenceDiagram
    participant EmailWorker as Email Worker<br/>(Background Job)
    participant Database
    participant RateLimiter as Rate Limiter (Redis)
    participant SMTPServer as SMTP Server / SendGrid
    participant Logger as Logger

    loop Every 30 seconds
        EmailWorker->>Database: SELECT FROM email_queue<br/>WHERE status = 'PENDING'<br/>ORDER BY<br/>  CASE category<br/>    WHEN 'ACCOUNT' THEN 1<br/>    WHEN 'PAYMENT' THEN 2<br/>    WHEN 'ORDER' THEN 3<br/>    WHEN 'GAME' THEN 4<br/>    ELSE 5<br/>  END,<br/>  created_at ASC<br/>LIMIT 100

        Database-->>EmailWorker: Batch of emails

        alt No emails in queue
            EmailWorker->>EmailWorker: Sleep 30 seconds
        else Has emails to process
            loop For each email in batch
                EmailWorker->>Database: UPDATE email_queue<br/>SET status = 'SENDING'<br/>WHERE id = ?

                EmailWorker->>RateLimiter: Check rate limit<br/>Key: email:{user_id}<br/>Limit: 100/minute

                alt Rate limit exceeded
                    RateLimiter-->>EmailWorker: Rate limit hit
                    EmailWorker->>Database: UPDATE email_queue<br/>SET status = 'PENDING'<br/>WHERE id = ?
                    EmailWorker->>EmailWorker: Skip to next email
                else Rate limit OK
                    RateLimiter-->>EmailWorker: Allowed

                    EmailWorker->>SMTPServer: POST /send<br/>{to, subject, html, text}

                    alt Send successful
                        SMTPServer-->>EmailWorker: 200 OK<br/>{message_id}

                        EmailWorker->>Database: BEGIN TRANSACTION
                        EmailWorker->>Database: UPDATE email_queue<br/>SET status = 'SENT',<br/>    sent_at = NOW()
                        EmailWorker->>Database: UPDATE notifications<br/>SET sent_at = NOW()<br/>WHERE type = 'EMAIL'<br/>  AND user_id = ?<br/>  AND created_at >= ?
                        EmailWorker->>Database: COMMIT

                        EmailWorker->>Logger: Log success<br/>{email_id, message_id}

                    else Send failed
                        SMTPServer-->>EmailWorker: 5xx Error<br/>{error_message}

                        EmailWorker->>EmailWorker: Calculate retry delay<br/>Attempt 1: 5 min<br/>Attempt 2: 30 min<br/>Attempt 3: 2 hours

                        alt Retry count < 3
                            EmailWorker->>Database: UPDATE email_queue<br/>SET status = 'PENDING',<br/>    retry_count = retry_count + 1,<br/>    error_message = ?

                            EmailWorker->>Logger: Log retry<br/>{email_id, attempt, error}

                        else Max retries reached
                            EmailWorker->>Database: UPDATE email_queue<br/>SET status = 'FAILED',<br/>    error_message = ?

                            EmailWorker->>Logger: Log failure<br/>{email_id, error}

                            EmailWorker->>EmailWorker: Send alert to admin<br/>(Email delivery failed)
                        end
                    end
                end
            end
        end
    end
```

### Steps

1. **Batch Processing**

    - Worker chạy mỗi 30 giây
    - Query 100 emails PENDING với priority ordering
    - ACCOUNT > PAYMENT > ORDER > GAME > PROMOTION

2. **Rate Limiting**

    - Check rate limit per user (100 emails/minute)
    - System-wide limit (10,000 emails/minute)
    - Skip email nếu limit exceeded, retry sau

3. **Email Sending**

    - Send qua SMTP server hoặc service (SendGrid, SES)
    - Update status sang SENDING để prevent duplicate
    - Log message_id từ provider

4. **Retry Logic**

    - Failed emails retry with exponential backoff:
        - Attempt 1: 5 minutes
        - Attempt 2: 30 minutes
        - Attempt 3: 2 hours
    - Mark as FAILED sau 3 attempts
    - Alert admin cho failed emails

5. **Success Handling**
    - Update email_queue status to SENT
    - Update notifications table với sent_at timestamp
    - Log for monitoring

---

## 🔔 4. Push Notification Subscription Flow

### Mô tả

Flow đăng ký browser push notifications sử dụng Web Push API.

### Sequence Diagram

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant ServiceWorker as Service Worker
    participant Browser as Browser Push API
    participant NotificationService as Notification Service
    participant Database

    User->>Frontend: Visit website
    Frontend->>Frontend: Check notification permission

    alt Permission not granted
        Frontend->>User: Show "Enable Notifications" prompt
        User->>Frontend: Click "Enable"

        Frontend->>Browser: Request notification permission<br/>Notification.requestPermission()
        Browser-->>User: Browser permission dialog
        User->>Browser: Allow notifications
        Browser-->>Frontend: Permission granted
    end

    alt Permission granted
        Frontend->>ServiceWorker: Register service worker
        ServiceWorker-->>Frontend: Service worker registered

        Frontend->>ServiceWorker: Subscribe to push<br/>pushManager.subscribe({<br/>  userVisibleOnly: true,<br/>  applicationServerKey: VAPID_PUBLIC_KEY<br/>})

        ServiceWorker->>Browser: Request push subscription
        Browser-->>ServiceWorker: PushSubscription object<br/>{endpoint, keys: {p256dh, auth}}
        ServiceWorker-->>Frontend: Subscription details

        Frontend->>NotificationService: POST /push/subscribe<br/>{endpoint, p256dh_key, auth_key}
        NotificationService->>NotificationService: Extract user from JWT

        NotificationService->>Database: SELECT FROM push_subscriptions<br/>WHERE endpoint = ?

        alt Subscription exists
            Database-->>NotificationService: Existing subscription
            NotificationService->>Database: UPDATE push_subscriptions<br/>SET is_active = true,<br/>    updated_at = NOW()
        else New subscription
            Database-->>NotificationService: No subscription
            NotificationService->>Database: INSERT INTO push_subscriptions<br/>{user_id, endpoint, keys, ...}
        end

        NotificationService-->>Frontend: 200 OK<br/>{subscription_id}
        Frontend->>Frontend: Store subscription locally
        Frontend-->>User: Push notifications enabled!

    else Permission denied
        Browser-->>Frontend: Permission denied
        Frontend-->>User: Show message:<br/>"Enable notifications in browser settings"
    end

    Note over User,Database: Later: Sending push notification

    NotificationService->>Database: SELECT FROM push_subscriptions<br/>WHERE user_id = ? AND is_active = true
    Database-->>NotificationService: Active subscriptions

    loop For each subscription
        NotificationService->>Browser: Send Web Push<br/>webpush.sendNotification(<br/>  subscription,<br/>  payload,<br/>  options<br/>)

        alt Push successful
            Browser-->>NotificationService: 201 Created
            Browser->>ServiceWorker: Push event received
            ServiceWorker->>ServiceWorker: Show notification<br/>self.registration.showNotification()
            ServiceWorker-->>User: Browser notification displayed
        else Push failed (subscription invalid)
            Browser-->>NotificationService: 410 Gone
            NotificationService->>Database: UPDATE push_subscriptions<br/>SET is_active = false
        end
    end
```

### Steps

1. **Permission Request**

    - Check current permission status
    - Request permission nếu chưa có
    - Handle user choice (granted/denied)

2. **Service Worker Registration**

    - Register service worker để handle push events
    - Service worker runs in background

3. **Push Subscription**

    - Use Push API để create subscription
    - Get endpoint và encryption keys từ browser
    - VAPID keys cho authentication

4. **Save Subscription**

    - Send subscription details lên server
    - Store trong database
    - Associate với user account

5. **Send Push Notification**

    - Get active subscriptions từ database
    - Use Web Push library để send
    - Handle expired subscriptions (410 Gone)

6. **Display Notification**
    - Service worker receive push event
    - Show notification với title, body, icon, actions
    - Handle notification click events

---

## ⚙️ 5. Notification Preferences Management Flow

### Mô tả

Flow quản lý notification preferences của user.

### Sequence Diagram

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant NotificationService as Notification Service
    participant Database

    Note over User,Database: Get Current Preferences

    User->>Frontend: Navigate to Settings > Notifications
    Frontend->>NotificationService: GET /notifications/preferences
    NotificationService->>NotificationService: Extract userId from JWT

    NotificationService->>Database: SELECT FROM notification_preferences<br/>WHERE user_id = ?

    alt Preferences exist
        Database-->>NotificationService: Preferences data
    else No preferences (new user)
        Database-->>NotificationService: Not found
        NotificationService->>NotificationService: Create default preferences
        NotificationService->>Database: INSERT INTO notification_preferences<br/>{user_id, default settings}
        Database-->>NotificationService: Created preferences
    end

    NotificationService-->>Frontend: 200 OK<br/>{preferences}

    Frontend->>Frontend: Render preferences UI<br/>Toggle switches for each setting
    Frontend-->>User: Display current settings

    Note over User,Database: Update Preferences

    User->>Frontend: Toggle "Promotional Emails" OFF
    User->>Frontend: Enable "Order Push Notifications"
    User->>Frontend: Click "Save Changes"

    Frontend->>Frontend: Validate changes
    Frontend->>NotificationService: PUT /notifications/preferences<br/>{<br/>  categories: {<br/>    PROMOTION: {email: false, ...},<br/>    ORDER: {push: true, ...}<br/>  }<br/>}

    NotificationService->>NotificationService: Validate request data

    alt Validation passed
        NotificationService->>Database: UPDATE notification_preferences<br/>SET categories = ?,<br/>    updated_at = NOW()<br/>WHERE user_id = ?

        Database-->>NotificationService: Updated

        NotificationService->>Database: SELECT updated preferences
        Database-->>NotificationService: New preferences

        NotificationService-->>Frontend: 200 OK<br/>{updated_preferences}

        Frontend->>Frontend: Update UI with new settings
        Frontend-->>User: "Preferences saved successfully!"

    else Validation failed
        NotificationService-->>Frontend: 422 Validation Error<br/>{errors}
        Frontend-->>User: Show validation errors
    end

    Note over User,Database: Later: Preference Check During Notification

    NotificationService->>Database: SELECT FROM notification_preferences<br/>WHERE user_id = ?
    Database-->>NotificationService: Preferences

    NotificationService->>NotificationService: Check if notification allowed<br/>category = PROMOTION<br/>type = EMAIL<br/>preferences.categories.PROMOTION.email = false

    alt Notification allowed
        NotificationService->>NotificationService: Create notification
    else Notification blocked by preferences
        NotificationService->>NotificationService: Skip notification creation<br/>Log: User disabled PROMOTION emails
    end
```

### Steps

1. **Load Preferences**

    - Get preferences từ database
    - Create default preferences nếu user mới
    - Display trong settings UI

2. **Update Preferences**

    - User toggle settings trong UI
    - Validate changes client-side
    - Send PUT request với updated preferences

3. **Save Changes**

    - Validate data server-side
    - Update database
    - Return updated preferences

4. **Apply Preferences**
    - Check preferences trước khi create notification
    - Skip nếu user disabled notification type/category
    - Log skipped notifications for analytics

### Default Preferences

```json
{
    "email_enabled": true,
    "in_app_enabled": true,
    "push_enabled": false,
    "categories": {
        "ORDER": {
            "email": true,
            "in_app": true,
            "push": false
        },
        "PAYMENT": {
            "email": true,
            "in_app": true,
            "push": false
        },
        "GAME": {
            "email": true,
            "in_app": true,
            "push": false
        },
        "ACCOUNT": {
            "email": true,
            "in_app": true,
            "push": false
        },
        "PROMOTION": {
            "email": false,
            "in_app": true,
            "push": false
        },
        "SYSTEM": {
            "email": true,
            "in_app": true,
            "push": false
        }
    }
}
```

---

## 📅 6. Scheduled Notification Flow

### Mô tả

Flow gửi notifications được schedule trước (gửi sau).

### Sequence Diagram

```mermaid
sequenceDiagram
    participant Admin
    participant NotificationService as Notification Service
    participant Database
    participant SchedulerJob as Scheduler Job<br/>(Background)
    participant Kafka as Kafka Event Bus

    Note over Admin,Kafka: Create Scheduled Notification

    Admin->>NotificationService: POST /notifications/send<br/>{<br/>  user_id: "uuid",<br/>  type: "EMAIL",<br/>  category: "PROMOTION",<br/>  title: "Weekend Sale",<br/>  message: "50% off all games",<br/>  scheduled_at: "2025-10-05T09:00:00Z"<br/>}

    NotificationService->>NotificationService: Validate request<br/>Check scheduled_at > NOW()

    NotificationService->>Database: INSERT INTO scheduled_notifications<br/>{...data, status: 'PENDING'}
    Database-->>NotificationService: Created

    NotificationService-->>Admin: 201 Created<br/>{scheduled_notification_id}

    Note over SchedulerJob,Kafka: Background Job Processing

    loop Every 1 minute
        SchedulerJob->>Database: SELECT FROM scheduled_notifications<br/>WHERE status = 'PENDING'<br/>  AND scheduled_at <= NOW()<br/>ORDER BY scheduled_at ASC<br/>LIMIT 100

        Database-->>SchedulerJob: Batch of due notifications

        alt Has notifications to send
            loop For each scheduled notification
                SchedulerJob->>Database: UPDATE scheduled_notifications<br/>SET status = 'SENDING'<br/>WHERE id = ?

                SchedulerJob->>SchedulerJob: Create notification event<br/>NotificationEvent {<br/>  userId, type, category,<br/>  title, message, data<br/>}

                SchedulerJob->>Kafka: Publish NotificationEvent

                alt Event published successfully
                    Kafka-->>SchedulerJob: ACK

                    SchedulerJob->>Database: UPDATE scheduled_notifications<br/>SET status = 'SENT',<br/>    sent_at = NOW()

                    Note over NotificationService: Normal notification flow continues

                    Kafka->>NotificationService: Consume NotificationEvent
                    NotificationService->>NotificationService: Process notification<br/>(check preferences, create, send)

                else Event publish failed
                    Kafka-->>SchedulerJob: Error

                    SchedulerJob->>Database: UPDATE scheduled_notifications<br/>SET status = 'FAILED'

                    SchedulerJob->>SchedulerJob: Log error<br/>Alert admin
                end
            end
        else No notifications due
            SchedulerJob->>SchedulerJob: Sleep 1 minute
        end
    end

    Note over Admin,Database: Admin cancels scheduled notification

    Admin->>NotificationService: DELETE /scheduled-notifications/{id}

    NotificationService->>Database: SELECT FROM scheduled_notifications<br/>WHERE id = ? AND status = 'PENDING'

    alt Notification is PENDING
        Database-->>NotificationService: Notification found

        NotificationService->>Database: UPDATE scheduled_notifications<br/>SET status = 'CANCELLED'

        NotificationService-->>Admin: 200 OK<br/>Notification cancelled

    else Already sent or not found
        Database-->>NotificationService: Not found or already processed
        NotificationService-->>Admin: 400 Bad Request<br/>Cannot cancel
    end
```

### Steps

1. **Create Scheduled Notification**

    - Admin/System create notification với `scheduled_at` trong tương lai
    - Validate scheduled time
    - Store trong `scheduled_notifications` table với status PENDING

2. **Background Scheduler**

    - Job chạy mỗi 1 phút
    - Query notifications có scheduled_at <= NOW()
    - Process batch of 100 notifications

3. **Send Scheduled Notification**

    - Update status to SENDING
    - Publish event lên Kafka
    - Normal notification flow tiếp tục từ event

4. **Handle Results**

    - Success: Update status to SENT
    - Failed: Update status to FAILED, alert admin

5. **Cancellation**
    - Admin có thể cancel PENDING notifications
    - Cannot cancel đã SENT hoặc SENDING

### Use Cases

-   **Marketing campaigns**: Schedule promotional emails
-   **Event reminders**: Remind users về upcoming events
-   **Subscription renewals**: Notify trước khi subscription expires
-   **Maintenance notifications**: Schedule system maintenance alerts

---

## 📚 Related Documentation

-   [[notification-service-api]] - Notification Service API specification
-   [[notification-db]] - Notification Service database schema
-   [[event-driven-design]] - Event-driven architecture design
-   [[kafka-topics]] - Kafka topics và event schemas
-   [[api-standards]] - API design standards

---

**Version**: 1.0.0  
**Last Updated**: 2025-10-03  
**Maintained by**: Backend Team

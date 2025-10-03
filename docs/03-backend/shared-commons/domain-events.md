# Domain Events

## 📋 Tổng quan

Tài liệu này định nghĩa các domain event structures sử dụng cho event-driven communication giữa các microservices thông qua Apache Kafka.

## 🎯 Event Design Principles

### 1. Event Structure
- **Immutable**: Events không thể thay đổi sau khi publish
- **Self-contained**: Chứa đủ thông tin để consumer xử lý
- **Versioned**: Support schema evolution
- **Timestamped**: Track thời gian xảy ra event

### 2. Event Naming Convention
- Pattern: `{Domain}{Action}Event`
- Examples: `UserRegisteredEvent`, `OrderCreatedEvent`, `PaymentCompletedEvent`
- Use past tense (đã xảy ra)

### 3. Event Types
- **Domain Events**: Business events (e.g., OrderPlaced)
- **Integration Events**: Cross-service events
- **System Events**: Technical events (e.g., ServiceStarted)

## 📦 Base Event Classes

### 1. BaseEvent

Abstract base class cho tất cả events:

```java
package com.ecommerce.commons.event;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.io.Serializable;
import java.time.Instant;
import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "eventType"
)
@JsonSubTypes({
    @JsonSubTypes.Type(value = UserEvent.class, name = "USER_EVENT"),
    @JsonSubTypes.Type(value = OrderEvent.class, name = "ORDER_EVENT"),
    @JsonSubTypes.Type(value = PaymentEvent.class, name = "PAYMENT_EVENT"),
    @JsonSubTypes.Type(value = NotificationEvent.class, name = "NOTIFICATION_EVENT")
})
public abstract class BaseEvent implements Serializable {
    
    /**
     * Unique event ID
     */
    private UUID eventId;
    
    /**
     * Event type identifier
     */
    private String eventType;
    
    /**
     * Timestamp when event occurred
     */
    private Instant timestamp;
    
    /**
     * Service that published the event
     */
    private String source;
    
    /**
     * Event schema version
     */
    private String version;
    
    /**
     * Correlation ID for tracing
     */
    private String correlationId;
    
    /**
     * Initialize default values
     */
    protected void initDefaults(String eventType, String source) {
        this.eventId = UUID.randomUUID();
        this.eventType = eventType;
        this.timestamp = Instant.now();
        this.source = source;
        this.version = "1.0";
        this.correlationId = UUID.randomUUID().toString();
    }
}
```

## 📨 User Events

Events liên quan đến User service:

```java
package com.ecommerce.commons.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class UserEvent extends BaseEvent {
    
    /**
     * Event action types
     */
    public enum Action {
        REGISTERED,
        EMAIL_VERIFIED,
        PROFILE_UPDATED,
        PASSWORD_CHANGED,
        ACCOUNT_ACTIVATED,
        ACCOUNT_DEACTIVATED,
        ACCOUNT_DELETED
    }
    
    /**
     * User ID
     */
    private UUID userId;
    
    /**
     * User email
     */
    private String email;
    
    /**
     * User username
     */
    private String username;
    
    /**
     * Event action
     */
    private Action action;
    
    /**
     * Additional event data
     */
    private Object data;
    
    // Factory methods
    public static UserEvent registered(UUID userId, String email, String username) {
        UserEvent event = UserEvent.builder()
                .userId(userId)
                .email(email)
                .username(username)
                .action(Action.REGISTERED)
                .build();
        event.initDefaults("USER_REGISTERED", "user-service");
        return event;
    }
    
    public static UserEvent emailVerified(UUID userId, String email) {
        UserEvent event = UserEvent.builder()
                .userId(userId)
                .email(email)
                .action(Action.EMAIL_VERIFIED)
                .build();
        event.initDefaults("USER_EMAIL_VERIFIED", "user-service");
        return event;
    }
    
    public static UserEvent profileUpdated(UUID userId, Object data) {
        UserEvent event = UserEvent.builder()
                .userId(userId)
                .action(Action.PROFILE_UPDATED)
                .data(data)
                .build();
        event.initDefaults("USER_PROFILE_UPDATED", "user-service");
        return event;
    }
}
```

## 📦 Order Events

Events liên quan đến Order service:

```java
package com.ecommerce.commons.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class OrderEvent extends BaseEvent {
    
    /**
     * Event action types
     */
    public enum Action {
        CREATED,
        CONFIRMED,
        PAID,
        SHIPPED,
        DELIVERED,
        CANCELLED,
        REFUNDED
    }
    
    /**
     * Order ID
     */
    private UUID orderId;
    
    /**
     * User ID
     */
    private UUID userId;
    
    /**
     * Order total amount
     */
    private BigDecimal totalAmount;
    
    /**
     * Order items
     */
    private List<OrderItem> items;
    
    /**
     * Event action
     */
    private Action action;
    
    /**
     * Additional event data
     */
    private Object data;
    
    @Data
    @SuperBuilder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItem {
        private UUID gameId;
        private String gameName;
        private BigDecimal price;
        private Integer quantity;
    }
    
    // Factory methods
    public static OrderEvent created(UUID orderId, UUID userId, BigDecimal totalAmount, List<OrderItem> items) {
        OrderEvent event = OrderEvent.builder()
                .orderId(orderId)
                .userId(userId)
                .totalAmount(totalAmount)
                .items(items)
                .action(Action.CREATED)
                .build();
        event.initDefaults("ORDER_CREATED", "order-service");
        return event;
    }
    
    public static OrderEvent paid(UUID orderId, UUID userId, BigDecimal totalAmount) {
        OrderEvent event = OrderEvent.builder()
                .orderId(orderId)
                .userId(userId)
                .totalAmount(totalAmount)
                .action(Action.PAID)
                .build();
        event.initDefaults("ORDER_PAID", "order-service");
        return event;
    }
    
    public static OrderEvent cancelled(UUID orderId, UUID userId, String reason) {
        OrderEvent event = OrderEvent.builder()
                .orderId(orderId)
                .userId(userId)
                .action(Action.CANCELLED)
                .data(reason)
                .build();
        event.initDefaults("ORDER_CANCELLED", "order-service");
        return event;
    }
}
```

## 💳 Payment Events

Events liên quan đến Payment service:

```java
package com.ecommerce.commons.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class PaymentEvent extends BaseEvent {
    
    /**
     * Event action types
     */
    public enum Action {
        INITIATED,
        PROCESSING,
        COMPLETED,
        FAILED,
        REFUNDED
    }
    
    /**
     * Payment ID
     */
    private UUID paymentId;
    
    /**
     * Order ID
     */
    private UUID orderId;
    
    /**
     * User ID
     */
    private UUID userId;
    
    /**
     * Payment amount
     */
    private BigDecimal amount;
    
    /**
     * Payment method
     */
    private String paymentMethod;
    
    /**
     * Event action
     */
    private Action action;
    
    /**
     * Transaction ID from payment gateway
     */
    private String transactionId;
    
    /**
     * Additional event data
     */
    private Object data;
    
    // Factory methods
    public static PaymentEvent completed(
            UUID paymentId, 
            UUID orderId, 
            UUID userId, 
            BigDecimal amount, 
            String transactionId) {
        PaymentEvent event = PaymentEvent.builder()
                .paymentId(paymentId)
                .orderId(orderId)
                .userId(userId)
                .amount(amount)
                .transactionId(transactionId)
                .action(Action.COMPLETED)
                .build();
        event.initDefaults("PAYMENT_COMPLETED", "payment-service");
        return event;
    }
    
    public static PaymentEvent failed(
            UUID paymentId, 
            UUID orderId, 
            UUID userId, 
            BigDecimal amount, 
            String reason) {
        PaymentEvent event = PaymentEvent.builder()
                .paymentId(paymentId)
                .orderId(orderId)
                .userId(userId)
                .amount(amount)
                .action(Action.FAILED)
                .data(reason)
                .build();
        event.initDefaults("PAYMENT_FAILED", "payment-service");
        return event;
    }
}
```

## 🔔 Notification Events

Events để trigger notifications:

```java
package com.ecommerce.commons.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.Map;
import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class NotificationEvent extends BaseEvent {
    
    /**
     * Notification types
     */
    public enum Type {
        EMAIL,
        PUSH,
        SMS,
        IN_APP
    }
    
    /**
     * User ID to notify
     */
    private UUID userId;
    
    /**
     * Notification type
     */
    private Type type;
    
    /**
     * Notification template code
     */
    private String templateCode;
    
    /**
     * Template variables
     */
    private Map<String, Object> variables;
    
    /**
     * Recipient email (for email notifications)
     */
    private String recipientEmail;
    
    /**
     * Notification priority
     */
    private String priority; // HIGH, MEDIUM, LOW
    
    // Factory methods
    public static NotificationEvent email(
            UUID userId, 
            String recipientEmail, 
            String templateCode, 
            Map<String, Object> variables) {
        NotificationEvent event = NotificationEvent.builder()
                .userId(userId)
                .recipientEmail(recipientEmail)
                .type(Type.EMAIL)
                .templateCode(templateCode)
                .variables(variables)
                .priority("MEDIUM")
                .build();
        event.initDefaults("NOTIFICATION_EMAIL", "notification-service");
        return event;
    }
    
    public static NotificationEvent push(
            UUID userId, 
            String templateCode, 
            Map<String, Object> variables) {
        NotificationEvent event = NotificationEvent.builder()
                .userId(userId)
                .type(Type.PUSH)
                .templateCode(templateCode)
                .variables(variables)
                .priority("HIGH")
                .build();
        event.initDefaults("NOTIFICATION_PUSH", "notification-service");
        return event;
    }
    
    public static NotificationEvent inApp(
            UUID userId, 
            String templateCode, 
            Map<String, Object> variables) {
        NotificationEvent event = NotificationEvent.builder()
                .userId(userId)
                .type(Type.IN_APP)
                .templateCode(templateCode)
                .variables(variables)
                .priority("LOW")
                .build();
        event.initDefaults("NOTIFICATION_IN_APP", "notification-service");
        return event;
    }
}
```

## 🎨 Usage Examples

### Publishing Events

```java
@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    
    private final UserRepository userRepository;
    private final KafkaTemplate<String, UserEvent> kafkaTemplate;
    
    @Transactional
    public User register(RegisterRequest request) {
        // Create user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        user = userRepository.save(user);
        
        // Publish event
        UserEvent event = UserEvent.registered(
            user.getId(),
            user.getEmail(),
            user.getUsername()
        );
        
        kafkaTemplate.send("user-events", user.getId().toString(), event)
            .whenComplete((result, ex) -> {
                if (ex != null) {
                    log.error("Failed to publish user registered event", ex);
                } else {
                    log.info("Published user registered event: userId={}", user.getId());
                }
            });
        
        return user;
    }
}
```

### Consuming Events

```java
@Service
@Slf4j
public class NotificationEventConsumer {
    
    @Autowired
    private NotificationService notificationService;
    
    @KafkaListener(
        topics = "user-events",
        groupId = "notification-service",
        containerFactory = "kafkaListenerContainerFactory"
    )
    public void consumeUserEvent(UserEvent event) {
        log.info("Received user event: type={}, userId={}", 
            event.getEventType(), event.getUserId());
        
        try {
            switch (event.getAction()) {
                case REGISTERED -> handleUserRegistered(event);
                case EMAIL_VERIFIED -> handleEmailVerified(event);
                case PASSWORD_CHANGED -> handlePasswordChanged(event);
                default -> log.warn("Unhandled user event action: {}", event.getAction());
            }
        } catch (Exception e) {
            log.error("Error processing user event: eventId={}", event.getEventId(), e);
            // Handle error (retry, dead letter queue, etc.)
        }
    }
    
    private void handleUserRegistered(UserEvent event) {
        // Send welcome email
        Map<String, Object> variables = Map.of(
            "username", event.getUsername(),
            "email", event.getEmail()
        );
        
        notificationService.sendEmail(
            event.getUserId(),
            event.getEmail(),
            "WELCOME_EMAIL",
            variables
        );
    }
    
    private void handleEmailVerified(UserEvent event) {
        // Send email verification confirmation
        notificationService.sendEmail(
            event.getUserId(),
            event.getEmail(),
            "EMAIL_VERIFIED",
            Map.of("email", event.getEmail())
        );
    }
    
    private void handlePasswordChanged(UserEvent event) {
        // Send security alert
        notificationService.sendEmail(
            event.getUserId(),
            event.getEmail(),
            "PASSWORD_CHANGED_ALERT",
            Map.of()
        );
    }
}
```

### Order Event Consumer (Inventory Service)

```java
@Service
@Slf4j
public class OrderEventConsumer {
    
    @Autowired
    private InventoryService inventoryService;
    
    @KafkaListener(
        topics = "order-events",
        groupId = "inventory-service",
        containerFactory = "kafkaListenerContainerFactory"
    )
    public void consumeOrderEvent(OrderEvent event) {
        log.info("Received order event: type={}, orderId={}", 
            event.getEventType(), event.getOrderId());
        
        try {
            switch (event.getAction()) {
                case CREATED -> handleOrderCreated(event);
                case CANCELLED -> handleOrderCancelled(event);
                default -> log.debug("Ignoring order event action: {}", event.getAction());
            }
        } catch (Exception e) {
            log.error("Error processing order event: eventId={}", event.getEventId(), e);
        }
    }
    
    private void handleOrderCreated(OrderEvent event) {
        // Reserve inventory
        event.getItems().forEach(item -> {
            inventoryService.reserveStock(
                item.getGameId(),
                item.getQuantity(),
                event.getOrderId()
            );
        });
    }
    
    private void handleOrderCancelled(OrderEvent event) {
        // Release reserved inventory
        event.getItems().forEach(item -> {
            inventoryService.releaseStock(
                item.getGameId(),
                item.getQuantity(),
                event.getOrderId()
            );
        });
    }
}
```

## 🔧 Kafka Configuration

```java
package com.ecommerce.commons.config;

import com.ecommerce.commons.event.*;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.*;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import org.springframework.kafka.support.serializer.JsonSerializer;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class KafkaConfig {
    
    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;
    
    // Producer Configuration
    @Bean
    public ProducerFactory<String, BaseEvent> producerFactory() {
        Map<String, Object> config = new HashMap<>();
        config.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        config.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        config.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
        config.put(ProducerConfig.ACKS_CONFIG, "all");
        config.put(ProducerConfig.RETRIES_CONFIG, 3);
        config.put(ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG, true);
        
        return new DefaultKafkaProducerFactory<>(config);
    }
    
    @Bean
    public KafkaTemplate<String, BaseEvent> kafkaTemplate() {
        return new KafkaTemplate<>(producerFactory());
    }
    
    // Consumer Configuration
    @Bean
    public ConsumerFactory<String, BaseEvent> consumerFactory() {
        Map<String, Object> config = new HashMap<>();
        config.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        config.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        config.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
        config.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        config.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, false);
        config.put(JsonDeserializer.TRUSTED_PACKAGES, "com.ecommerce.commons.event");
        config.put(JsonDeserializer.USE_TYPE_INFO_HEADERS, false);
        config.put(JsonDeserializer.VALUE_DEFAULT_TYPE, BaseEvent.class);
        
        return new DefaultKafkaConsumerFactory<>(
            config,
            new StringDeserializer(),
            new JsonDeserializer<>(BaseEvent.class, false)
        );
    }
    
    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, BaseEvent> kafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, BaseEvent> factory = 
            new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory());
        factory.setConcurrency(3);
        factory.getContainerProperties().setAckMode(ContainerProperties.AckMode.MANUAL);
        
        return factory;
    }
}
```

## ✅ Best Practices

1. **Event Immutability**: Events không thể thay đổi sau khi publish
2. **Schema Evolution**: Sử dụng versioning để support backward compatibility
3. **Idempotency**: Consumers phải handle duplicate events
4. **Error Handling**: Implement retry logic và dead letter queue
5. **Correlation ID**: Sử dụng để trace events across services
6. **Monitoring**: Track event publishing/consuming metrics
7. **Testing**: Test event publishing và consuming separately

---

**Next**: [Constants →](./constants.md)

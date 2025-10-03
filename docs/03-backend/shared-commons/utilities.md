# Utilities

## 📋 Tổng quan

Tài liệu này định nghĩa các utility classes cung cấp các helper methods dùng chung trong toàn bộ hệ thống.

## 📦 Utility Classes

### 1. UUIDUtil

Utility cho UUID generation và validation:

```java
package com.ecommerce.commons.util;

import lombok.experimental.UtilityClass;

import java.util.UUID;
import java.util.regex.Pattern;

@UtilityClass
public class UUIDUtil {
    
    private static final Pattern UUID_PATTERN = Pattern.compile(
        "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
        Pattern.CASE_INSENSITIVE
    );
    
    /**
     * Generate a new random UUID
     */
    public static UUID generate() {
        return UUID.randomUUID();
    }
    
    /**
     * Generate a new random UUID as string
     */
    public static String generateString() {
        return UUID.randomUUID().toString();
    }
    
    /**
     * Validate if string is valid UUID format
     */
    public static boolean isValid(String uuid) {
        if (uuid == null || uuid.trim().isEmpty()) {
            return false;
        }
        return UUID_PATTERN.matcher(uuid.trim()).matches();
    }
    
    /**
     * Parse string to UUID safely
     * @return UUID or null if invalid
     */
    public static UUID parse(String uuid) {
        if (!isValid(uuid)) {
            return null;
        }
        try {
            return UUID.fromString(uuid.trim());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
    
    /**
     * Parse string to UUID or throw exception
     */
    public static UUID parseOrThrow(String uuid) {
        UUID result = parse(uuid);
        if (result == null) {
            throw new IllegalArgumentException("Invalid UUID format: " + uuid);
        }
        return result;
    }
    
    /**
     * Convert UUID to string safely
     */
    public static String toString(UUID uuid) {
        return uuid != null ? uuid.toString() : null;
    }
}
```

### 2. DateTimeUtil

Utility cho date/time operations:

```java
package com.ecommerce.commons.util;

import lombok.experimental.UtilityClass;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

@UtilityClass
public class DateTimeUtil {
    
    // Common formatters
    public static final DateTimeFormatter ISO_FORMATTER = DateTimeFormatter.ISO_INSTANT;
    public static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    public static final DateTimeFormatter DATETIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    
    /**
     * Get current UTC instant
     */
    public static Instant nowUtc() {
        return Instant.now();
    }
    
    /**
     * Get current date time in UTC
     */
    public static LocalDateTime nowUtcDateTime() {
        return LocalDateTime.now(ZoneOffset.UTC);
    }
    
    /**
     * Get current date in UTC
     */
    public static LocalDate nowUtcDate() {
        return LocalDate.now(ZoneOffset.UTC);
    }
    
    /**
     * Convert instant to local date time in UTC
     */
    public static LocalDateTime toUtcDateTime(Instant instant) {
        return LocalDateTime.ofInstant(instant, ZoneOffset.UTC);
    }
    
    /**
     * Convert local date time to instant (assumes UTC)
     */
    public static Instant toInstant(LocalDateTime dateTime) {
        return dateTime.toInstant(ZoneOffset.UTC);
    }
    
    /**
     * Format instant to ISO string
     */
    public static String formatIso(Instant instant) {
        return instant != null ? ISO_FORMATTER.format(instant) : null;
    }
    
    /**
     * Parse ISO string to instant
     */
    public static Instant parseIso(String isoString) {
        return isoString != null ? Instant.parse(isoString) : null;
    }
    
    /**
     * Format date time
     */
    public static String formatDateTime(LocalDateTime dateTime) {
        return dateTime != null ? DATETIME_FORMATTER.format(dateTime) : null;
    }
    
    /**
     * Format date
     */
    public static String formatDate(LocalDate date) {
        return date != null ? DATE_FORMATTER.format(date) : null;
    }
    
    /**
     * Check if instant is in the past
     */
    public static boolean isPast(Instant instant) {
        return instant != null && instant.isBefore(Instant.now());
    }
    
    /**
     * Check if instant is in the future
     */
    public static boolean isFuture(Instant instant) {
        return instant != null && instant.isAfter(Instant.now());
    }
    
    /**
     * Add duration to instant
     */
    public static Instant addDuration(Instant instant, Duration duration) {
        return instant != null ? instant.plus(duration) : null;
    }
    
    /**
     * Add days to instant
     */
    public static Instant addDays(Instant instant, long days) {
        return instant != null ? instant.plus(days, ChronoUnit.DAYS) : null;
    }
    
    /**
     * Add hours to instant
     */
    public static Instant addHours(Instant instant, long hours) {
        return instant != null ? instant.plus(hours, ChronoUnit.HOURS) : null;
    }
    
    /**
     * Add minutes to instant
     */
    public static Instant addMinutes(Instant instant, long minutes) {
        return instant != null ? instant.plus(minutes, ChronoUnit.MINUTES) : null;
    }
    
    /**
     * Calculate difference in days
     */
    public static long daysBetween(Instant start, Instant end) {
        if (start == null || end == null) {
            return 0;
        }
        return ChronoUnit.DAYS.between(start, end);
    }
    
    /**
     * Calculate difference in hours
     */
    public static long hoursBetween(Instant start, Instant end) {
        if (start == null || end == null) {
            return 0;
        }
        return ChronoUnit.HOURS.between(start, end);
    }
    
    /**
     * Get start of day (UTC)
     */
    public static Instant startOfDay(LocalDate date) {
        return date != null 
            ? date.atStartOfDay().toInstant(ZoneOffset.UTC) 
            : null;
    }
    
    /**
     * Get end of day (UTC)
     */
    public static Instant endOfDay(LocalDate date) {
        return date != null 
            ? date.atTime(23, 59, 59, 999999999).toInstant(ZoneOffset.UTC) 
            : null;
    }
}
```

### 3. StringUtil

Utility cho string operations:

```java
package com.ecommerce.commons.util;

import lombok.experimental.UtilityClass;
import org.apache.commons.lang3.StringUtils;

import java.text.Normalizer;
import java.util.regex.Pattern;

@UtilityClass
public class StringUtil {
    
    private static final Pattern SPECIAL_CHARS = Pattern.compile("[^a-zA-Z0-9-_]");
    private static final Pattern MULTIPLE_SPACES = Pattern.compile("\\s+");
    private static final Pattern NON_ASCII = Pattern.compile("[^\\x00-\\x7F]");
    
    /**
     * Check if string is null or empty
     */
    public static boolean isEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }
    
    /**
     * Check if string is not empty
     */
    public static boolean isNotEmpty(String str) {
        return !isEmpty(str);
    }
    
    /**
     * Trim string safely
     */
    public static String trim(String str) {
        return str != null ? str.trim() : null;
    }
    
    /**
     * Convert to lowercase safely
     */
    public static String toLowerCase(String str) {
        return str != null ? str.toLowerCase() : null;
    }
    
    /**
     * Convert to uppercase safely
     */
    public static String toUpperCase(String str) {
        return str != null ? str.toUpperCase() : null;
    }
    
    /**
     * Capitalize first letter
     */
    public static String capitalize(String str) {
        if (isEmpty(str)) {
            return str;
        }
        return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
    }
    
    /**
     * Convert to slug (URL-friendly string)
     */
    public static String toSlug(String str) {
        if (isEmpty(str)) {
            return "";
        }
        
        // Normalize to remove accents
        String normalized = Normalizer.normalize(str, Normalizer.Form.NFD);
        normalized = NON_ASCII.matcher(normalized).replaceAll("");
        
        // Convert to lowercase
        normalized = normalized.toLowerCase();
        
        // Replace spaces with hyphens
        normalized = MULTIPLE_SPACES.matcher(normalized).replaceAll("-");
        
        // Remove special characters
        normalized = SPECIAL_CHARS.matcher(normalized).replaceAll("");
        
        // Remove leading/trailing hyphens
        normalized = normalized.replaceAll("^-+|-+$", "");
        
        return normalized;
    }
    
    /**
     * Truncate string to max length
     */
    public static String truncate(String str, int maxLength) {
        if (str == null || str.length() <= maxLength) {
            return str;
        }
        return str.substring(0, maxLength);
    }
    
    /**
     * Truncate string with ellipsis
     */
    public static String truncateWithEllipsis(String str, int maxLength) {
        if (str == null || str.length() <= maxLength) {
            return str;
        }
        if (maxLength <= 3) {
            return str.substring(0, maxLength);
        }
        return str.substring(0, maxLength - 3) + "...";
    }
    
    /**
     * Mask sensitive data (e.g., email, phone)
     */
    public static String maskEmail(String email) {
        if (isEmpty(email) || !email.contains("@")) {
            return email;
        }
        
        String[] parts = email.split("@");
        String local = parts[0];
        String domain = parts[1];
        
        if (local.length() <= 2) {
            return email;
        }
        
        String masked = local.charAt(0) + 
                       "*".repeat(local.length() - 2) + 
                       local.charAt(local.length() - 1);
        
        return masked + "@" + domain;
    }
    
    /**
     * Mask phone number
     */
    public static String maskPhone(String phone) {
        if (isEmpty(phone) || phone.length() < 4) {
            return phone;
        }
        
        String visible = phone.substring(phone.length() - 4);
        String masked = "*".repeat(phone.length() - 4);
        
        return masked + visible;
    }
    
    /**
     * Generate random string
     */
    public static String randomAlphanumeric(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder sb = new StringBuilder(length);
        
        for (int i = 0; i < length; i++) {
            int index = (int) (Math.random() * chars.length());
            sb.append(chars.charAt(index));
        }
        
        return sb.toString();
    }
    
    /**
     * Join strings with delimiter
     */
    public static String join(String delimiter, String... strings) {
        return String.join(delimiter, strings);
    }
    
    /**
     * Default value if string is empty
     */
    public static String defaultIfEmpty(String str, String defaultValue) {
        return isEmpty(str) ? defaultValue : str;
    }
}
```

### 4. JsonUtil

Utility cho JSON operations:

```java
package com.ecommerce.commons.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.experimental.UtilityClass;
import lombok.extern.slf4j.Slf4j;

import java.util.Map;

@Slf4j
@UtilityClass
public class JsonUtil {
    
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    
    /**
     * Convert object to JSON string
     */
    public static String toJson(Object obj) {
        try {
            return OBJECT_MAPPER.writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            log.error("Error converting object to JSON", e);
            return null;
        }
    }
    
    /**
     * Convert object to pretty JSON string
     */
    public static String toPrettyJson(Object obj) {
        try {
            return OBJECT_MAPPER.writerWithDefaultPrettyPrinter()
                    .writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            log.error("Error converting object to pretty JSON", e);
            return null;
        }
    }
    
    /**
     * Parse JSON string to object
     */
    public static <T> T fromJson(String json, Class<T> clazz) {
        try {
            return OBJECT_MAPPER.readValue(json, clazz);
        } catch (JsonProcessingException e) {
            log.error("Error parsing JSON to object", e);
            return null;
        }
    }
    
    /**
     * Parse JSON string to object with TypeReference
     */
    public static <T> T fromJson(String json, TypeReference<T> typeRef) {
        try {
            return OBJECT_MAPPER.readValue(json, typeRef);
        } catch (JsonProcessingException e) {
            log.error("Error parsing JSON to object", e);
            return null;
        }
    }
    
    /**
     * Convert object to Map
     */
    public static Map<String, Object> toMap(Object obj) {
        return OBJECT_MAPPER.convertValue(obj, new TypeReference<>() {});
    }
    
    /**
     * Convert Map to object
     */
    public static <T> T fromMap(Map<String, Object> map, Class<T> clazz) {
        return OBJECT_MAPPER.convertValue(map, clazz);
    }
    
    /**
     * Deep clone object via JSON
     */
    public static <T> T deepClone(T obj, Class<T> clazz) {
        try {
            String json = toJson(obj);
            return fromJson(json, clazz);
        } catch (Exception e) {
            log.error("Error cloning object", e);
            return null;
        }
    }
    
    /**
     * Check if string is valid JSON
     */
    public static boolean isValidJson(String json) {
        try {
            OBJECT_MAPPER.readTree(json);
            return true;
        } catch (JsonProcessingException e) {
            return false;
        }
    }
}
```

### 5. ValidationUtil

Utility cho validation:

```java
package com.ecommerce.commons.util;

import lombok.experimental.UtilityClass;

import java.util.regex.Pattern;

@UtilityClass
public class ValidationUtil {
    
    // Email pattern (RFC 5322 simplified)
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@" +
        "(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$"
    );
    
    // Phone pattern (international format)
    private static final Pattern PHONE_PATTERN = Pattern.compile(
        "^\\+?[1-9]\\d{1,14}$"
    );
    
    // Password pattern (min 8 chars, 1 upper, 1 lower, 1 digit)
    private static final Pattern PASSWORD_PATTERN = Pattern.compile(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$"
    );
    
    // Username pattern (alphanumeric, underscore, hyphen)
    private static final Pattern USERNAME_PATTERN = Pattern.compile(
        "^[a-zA-Z0-9_-]{3,20}$"
    );
    
    // URL pattern
    private static final Pattern URL_PATTERN = Pattern.compile(
        "^(https?|ftp)://[^\\s/$.?#].[^\\s]*$",
        Pattern.CASE_INSENSITIVE
    );
    
    /**
     * Validate email format
     */
    public static boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email).matches();
    }
    
    /**
     * Validate phone number
     */
    public static boolean isValidPhone(String phone) {
        return phone != null && PHONE_PATTERN.matcher(phone).matches();
    }
    
    /**
     * Validate password strength
     */
    public static boolean isValidPassword(String password) {
        return password != null && PASSWORD_PATTERN.matcher(password).matches();
    }
    
    /**
     * Validate username format
     */
    public static boolean isValidUsername(String username) {
        return username != null && USERNAME_PATTERN.matcher(username).matches();
    }
    
    /**
     * Validate URL format
     */
    public static boolean isValidUrl(String url) {
        return url != null && URL_PATTERN.matcher(url).matches();
    }
    
    /**
     * Check if string is numeric
     */
    public static boolean isNumeric(String str) {
        if (str == null || str.isEmpty()) {
            return false;
        }
        try {
            Double.parseDouble(str);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }
    
    /**
     * Check if string is alphanumeric
     */
    public static boolean isAlphanumeric(String str) {
        return str != null && str.matches("^[a-zA-Z0-9]+$");
    }
    
    /**
     * Validate string length range
     */
    public static boolean isLengthBetween(String str, int min, int max) {
        if (str == null) {
            return false;
        }
        int length = str.length();
        return length >= min && length <= max;
    }
    
    /**
     * Validate number range
     */
    public static boolean isInRange(Number number, Number min, Number max) {
        if (number == null) {
            return false;
        }
        double value = number.doubleValue();
        return value >= min.doubleValue() && value <= max.doubleValue();
    }
}
```

### 6. HashUtil

Utility cho hashing operations:

```java
package com.ecommerce.commons.util;

import lombok.experimental.UtilityClass;
import lombok.extern.slf4j.Slf4j;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

@Slf4j
@UtilityClass
public class HashUtil {
    
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    
    /**
     * Generate SHA-256 hash
     */
    public static String sha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            return bytesToHex(hash);
        } catch (NoSuchAlgorithmException e) {
            log.error("SHA-256 algorithm not found", e);
            return null;
        }
    }
    
    /**
     * Generate MD5 hash
     */
    public static String md5(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("MD5");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            return bytesToHex(hash);
        } catch (NoSuchAlgorithmException e) {
            log.error("MD5 algorithm not found", e);
            return null;
        }
    }
    
    /**
     * Generate random bytes
     */
    public static byte[] generateRandomBytes(int length) {
        byte[] bytes = new byte[length];
        SECURE_RANDOM.nextBytes(bytes);
        return bytes;
    }
    
    /**
     * Generate random token
     */
    public static String generateRandomToken(int length) {
        byte[] bytes = generateRandomBytes(length);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
    
    /**
     * Generate random alphanumeric string
     */
    public static String generateRandomAlphanumeric(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder sb = new StringBuilder(length);
        
        for (int i = 0; i < length; i++) {
            int index = SECURE_RANDOM.nextInt(chars.length());
            sb.append(chars.charAt(index));
        }
        
        return sb.toString();
    }
    
    /**
     * Convert bytes to hex string
     */
    private static String bytesToHex(byte[] bytes) {
        StringBuilder hexString = new StringBuilder(2 * bytes.length);
        for (byte b : bytes) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }
    
    /**
     * Verify hash
     */
    public static boolean verifySha256(String input, String hash) {
        String computed = sha256(input);
        return computed != null && computed.equals(hash);
    }
}
```

## 🎨 Usage Examples

### Example 1: User Registration

```java
@Service
public class UserService {
    
    public User register(RegisterRequest request) {
        // Validate input
        if (!ValidationUtil.isValidEmail(request.getEmail())) {
            throw new ValidationException("Invalid email format");
        }
        
        if (!ValidationUtil.isValidPassword(request.getPassword())) {
            throw new ValidationException(
                "Password must be at least 8 characters with uppercase, lowercase, and number"
            );
        }
        
        // Create user
        User user = new User();
        user.setId(UUIDUtil.generate());
        user.setEmail(StringUtil.toLowerCase(request.getEmail()));
        user.setUsername(StringUtil.trim(request.getUsername()));
        user.setCreatedAt(DateTimeUtil.nowUtc());
        
        return userRepository.save(user);
    }
}
```

### Example 2: Token Generation

```java
@Service
public class TokenService {
    
    public String generatePasswordResetToken(UUID userId) {
        // Generate random token
        String token = HashUtil.generateRandomToken(32);
        
        // Hash token for storage
        String hashedToken = HashUtil.sha256(token);
        
        // Calculate expiry (24 hours)
        Instant expiresAt = DateTimeUtil.addHours(DateTimeUtil.nowUtc(), 24);
        
        // Save token
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setUserId(userId);
        resetToken.setToken(hashedToken);
        resetToken.setExpiresAt(expiresAt);
        
        tokenRepository.save(resetToken);
        
        return token; // Return unhashed token to user
    }
    
    public boolean verifyToken(String token) {
        String hashedToken = HashUtil.sha256(token);
        
        PasswordResetToken resetToken = tokenRepository
            .findByToken(hashedToken)
            .orElseThrow(() -> new TokenInvalidException());
        
        // Check expiry
        if (DateTimeUtil.isPast(resetToken.getExpiresAt())) {
            throw new TokenExpiredException();
        }
        
        return true;
    }
}
```

### Example 3: Logging with Masking

```java
@Service
@Slf4j
public class AuditService {
    
    public void logUserUpdate(User user) {
        Map<String, Object> auditData = Map.of(
            "userId", UUIDUtil.toString(user.getId()),
            "email", StringUtil.maskEmail(user.getEmail()),
            "phone", StringUtil.maskPhone(user.getPhone()),
            "timestamp", DateTimeUtil.formatIso(DateTimeUtil.nowUtc())
        );
        
        log.info("User updated: {}", JsonUtil.toJson(auditData));
    }
}
```

## ✅ Best Practices

1. **Use @UtilityClass**: Lombok annotation để prevent instantiation
2. **Static Methods**: Tất cả utility methods nên là static
3. **Null Safety**: Handle null inputs gracefully
4. **Immutability**: Không modify input parameters
5. **Performance**: Cache pattern matchers và common objects
6. **Thread Safety**: Đảm bảo thread-safe nếu cần
7. **Logging**: Log errors appropriately
8. **Testing**: Unit test tất cả utility methods

---

**Next**: [Base Entities →](./base-entities.md)

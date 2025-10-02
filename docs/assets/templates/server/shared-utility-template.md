---
title: "Shared Utility Template"
type: template
created: "{{date}}"
updated: "{{date}}"
tags:
    - template
    - shared-commons
    - utility
    - backend
status: template
maintainer: "Backend Team"
---

# Shared Utility Template

> [!info] Template Mục Đích
> Template này hướng dẫn cách tạo và tài liệu hóa một utility class mới trong shared-commons.

## 📋 Thông Tin Utility

| Field | Giá Trị |
|-------|---------|
| **Utility Name** | `{{utility_name}}` |
| **Package** | `com.mydigitalcollection.commons.util` |
| **Purpose** | `{{utility_purpose}}` |
| **Author** | `{{author}}` |
| **Created Date** | `{{date}}` |

## 🎯 Mục Đích

<!-- Mô tả ngắn gọn về mục đích của utility class -->

## 🏗️ Implementation

### 📁 File Location

```
shared-commons/
└── src/
    └── main/
        └── java/
            └── com/
                └── mydigitalcollection/
                    └── commons/
                        └── util/
                            └── {{UtilityName}}.java
```

### 💻 Code Implementation

```java
package com.mydigitalcollection.commons.util;

import lombok.experimental.UtilityClass;
import lombok.extern.slf4j.Slf4j;

/**
 * {{Utility Description}}
 * 
 * @author {{author}}
 * @since {{version}}
 */
@Slf4j
@UtilityClass
public class {{UtilityName}} {
    
    // Constants
    private static final String DEFAULT_VALUE = "default";
    
    /**
     * {{Method description}}
     * 
     * @param input {{parameter description}}
     * @return {{return description}}
     * @throws IllegalArgumentException if input is invalid
     */
    public static String processInput(String input) {
        if (input == null || input.trim().isEmpty()) {
            throw new IllegalArgumentException("Input cannot be null or empty");
        }
        
        log.debug("Processing input: {}", input);
        
        // Implementation logic here
        String result = input.trim().toLowerCase();
        
        log.debug("Processed result: {}", result);
        return result;
    }
    
    /**
     * {{Method description}}
     * 
     * @param value {{parameter description}}
     * @return {{return description}}
     */
    public static boolean isValid(String value) {
        return value != null && !value.trim().isEmpty();
    }
}
```

### 🧪 Test Implementation

```java
package com.mydigitalcollection.commons.util;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.junit.jupiter.params.provider.NullAndEmptySource;

import static org.junit.jupiter.api.Assertions.*;

class {{UtilityName}}Test {
    
    @Test
    @DisplayName("Should process valid input correctly")
    void shouldProcessValidInput() {
        // Given
        String input = "  Valid Input  ";
        
        // When
        String result = {{UtilityName}}.processInput(input);
        
        // Then
        assertEquals("valid input", result);
    }
    
    @ParameterizedTest
    @NullAndEmptySource
    @ValueSource(strings = {"  ", "\t", "\n"})
    @DisplayName("Should throw exception for invalid input")
    void shouldThrowExceptionForInvalidInput(String input) {
        // When & Then
        assertThrows(IllegalArgumentException.class, 
                    () -> {{UtilityName}}.processInput(input));
    }
    
    @Test
    @DisplayName("Should validate input correctly")
    void shouldValidateInput() {
        // Valid cases
        assertTrue({{UtilityName}}.isValid("valid"));
        assertTrue({{UtilityName}}.isValid("  valid  "));
        
        // Invalid cases
        assertFalse({{UtilityName}}.isValid(null));
        assertFalse({{UtilityName}}.isValid(""));
        assertFalse({{UtilityName}}.isValid("  "));
    }
}
```

## 📚 Usage Examples

### 🔧 Basic Usage

```java
@Service
public class ExampleService {
    
    public void processData(String rawData) {
        // Validate input
        if (!{{UtilityName}}.isValid(rawData)) {
            throw new ValidationException("Invalid data provided");
        }
        
        // Process data
        String processedData = {{UtilityName}}.processInput(rawData);
        
        // Use processed data
        // ...
    }
}
```

### 🏗️ Advanced Usage

```java
@Component
public class DataProcessor {
    
    public List<String> processMultipleInputs(List<String> inputs) {
        return inputs.stream()
                    .filter({{UtilityName}}::isValid)
                    .map({{UtilityName}}::processInput)
                    .collect(Collectors.toList());
    }
}
```

## ⚠️ Considerations

### 🚨 Thread Safety

<!-- Mô tả về thread safety của utility class -->

### 🔒 Security Implications

<!-- Liệt kê các security considerations nếu có -->

### ⚡ Performance

<!-- Thảo luận về performance characteristics -->

### 📊 Dependencies

<!-- Liệt kê external dependencies nếu có -->

## 🔄 Integration

### 📦 Maven Dependency

Utility này sẽ có sẵn khi thêm shared-commons dependency:

```xml
<dependency>
    <groupId>com.mydigitalcollection</groupId>
    <artifactId>shared-commons</artifactId>
    <version>${project.version}</version>
</dependency>
```

### ⚙️ Configuration

```yaml
# application.yml (nếu cần configuration)
shared:
  {{utility_name}}:
    enabled: true
    {{config_property}}: {{config_value}}
```

## 📈 Metrics & Monitoring

### 📊 Metrics to Track

<!-- Liệt kê metrics cần track nếu có -->

### 🚨 Alerts

<!-- Định nghĩa alerts nếu cần -->

## 📋 Checklist

Trước khi merge utility class mới:

- [ ] ✅ Implementation hoàn thành
- [ ] ✅ Unit tests với coverage > 90%
- [ ] ✅ Integration tests (nếu cần)
- [ ] ✅ Performance tests (nếu cần)
- [ ] ✅ Documentation cập nhật
- [ ] ✅ Example usage code
- [ ] ✅ Code review completed
- [ ] ✅ Security review (nếu cần)

## 🔗 Related Documentation

- [[shared-commons.md|Shared Commons Overview]]
- [[../api-reference/README.md|API Reference]]
- [[../../07-testing/unit-testing.md|Unit Testing Guide]]

## 🏷️ Tags

#shared-commons #utility #template #backend #java #spring-boot

---

> **Note**: Template này nên được customize cho từng utility cụ thể.  
> **Review**: Mọi utility mới cần được review bởi team lead trước khi merge.

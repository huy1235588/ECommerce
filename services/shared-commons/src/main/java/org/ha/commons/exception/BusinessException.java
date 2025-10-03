package org.ha.commons.exception;

import lombok.Getter;

import java.util.HashMap;
import java.util.Map;

@Getter
public class BusinessException extends RuntimeException {
    private final String errorCode;
    private final Map<String, Object> metadata;

    public BusinessException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
        this.metadata = new HashMap<>();
    }

    public BusinessException(String errorCode, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
        this.metadata = new HashMap<>();
    }

    public BusinessException addMetadata(String key, Object value) {
        this.metadata.put(key, value);
        return this;
    }

    public BusinessException addMetadata(Map<String, Object> metadata) {
        this.metadata.putAll(metadata);
        return this;
    }
}

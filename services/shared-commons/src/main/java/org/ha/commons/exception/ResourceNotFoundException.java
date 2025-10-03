package org.ha.commons.exception;

import java.util.UUID;

public class ResourceNotFoundException extends BusinessException {
    private static final String DEFAULT_CODE = "RESOURCE_NOT_FOUND";

    public ResourceNotFoundException(String message) {
        super(DEFAULT_CODE, message);
    }

    public ResourceNotFoundException(String code, String message) {
        super(code, message);
    }

    // Convenience constructors
    public static ResourceNotFoundException of(String resourceType, UUID id) {
        return new ResourceNotFoundException(
                resourceType.toUpperCase() + "_NOT_FOUND",
                String.format("%s not found with id: %s", resourceType, id)
        );
    }

    public static ResourceNotFoundException of(String resourceType, String field, Object value) {
        return new ResourceNotFoundException(
                resourceType.toUpperCase() + "_NOT_FOUND",
                String.format("%s not found with %s: %s", resourceType, field, value)
        );
    }
}

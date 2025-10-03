package org.ha.commons.exception;

public class ResourceAlreadyExistsException extends BusinessException {
    private static final String DEFAULT_CODE = "RESOURCE_ALREADY_EXISTS";

    public ResourceAlreadyExistsException(String message) {
        super(DEFAULT_CODE, message);
    }

    public ResourceAlreadyExistsException(String code, String message) {
        super(code, message);
    }

    // Convenience constructor
    public static ResourceAlreadyExistsException of(String resourceType, String field, Object value) {
        return new ResourceAlreadyExistsException(
                resourceType.toUpperCase() + "_ALREADY_EXISTS",
                String.format("%s already exists with %s: %s", resourceType, field, value)
        );
    }
}

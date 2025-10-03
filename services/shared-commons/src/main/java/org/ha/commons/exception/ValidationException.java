package org.ha.commons.exception;

import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
public class ValidationException extends BusinessException{
    private static final String DEFAULT_CODE = "VALIDATION_ERROR";

    private final List<FieldError> fieldErrors;

    public ValidationException(String message) {
        super(DEFAULT_CODE, message);
        this.fieldErrors = new ArrayList<>();
    }

    public ValidationException(String message, List<FieldError> fieldErrors) {
        super(DEFAULT_CODE, message);
        this.fieldErrors = fieldErrors;
    }

    public ValidationException addFieldError(String field, String message) {
        this.fieldErrors.add(new FieldError(field, message, null));
        return this;
    }

    public ValidationException addFieldError(String field, String message, Object rejectedValue) {
        this.fieldErrors.add(new FieldError(field, message, rejectedValue));
        return this;
    }

    @Getter
    public static class FieldError {
        private final String field;
        private final String message;
        private final Object rejectedValue;

        public FieldError(String field, String message, Object rejectedValue) {
            this.field = field;
            this.message = message;
            this.rejectedValue = rejectedValue;
        }
    }
}

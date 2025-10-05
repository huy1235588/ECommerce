package org.ha.apigateway.exception;

import org.springframework.http.HttpStatus;

public class MissingTokenException extends AuthenticationException {
    public MissingTokenException() {
        super("MISSING_TOKEN", "Authentication token is required", HttpStatus.UNAUTHORIZED);
    }

    public MissingTokenException(String message) {
        super("MISSING_TOKEN", message, HttpStatus.UNAUTHORIZED);
    }
}
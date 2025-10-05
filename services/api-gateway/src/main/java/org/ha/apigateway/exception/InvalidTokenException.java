package org.ha.apigateway.exception;

import org.springframework.http.HttpStatus;

public class InvalidTokenException extends AuthenticationException {
    public InvalidTokenException() {
        super("INVALID_TOKEN", "Invalid authentication token", HttpStatus.UNAUTHORIZED);
    }

    public InvalidTokenException(String message) {
        super("INVALID_TOKEN", message, HttpStatus.UNAUTHORIZED);
    }
}
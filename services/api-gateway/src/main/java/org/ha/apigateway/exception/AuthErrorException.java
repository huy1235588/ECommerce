package org.ha.apigateway.exception;

import org.springframework.http.HttpStatus;

public class AuthErrorException extends AuthenticationException {
    public AuthErrorException() {
        super("AUTH_ERROR", "Authentication error occurred", HttpStatus.UNAUTHORIZED);
    }

    public AuthErrorException(String message) {
        super("AUTH_ERROR", message, HttpStatus.UNAUTHORIZED);
    }
}
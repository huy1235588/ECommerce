package org.ha.apigateway.exception;

import org.springframework.http.HttpStatus;

public class TokenExpiredException extends AuthenticationException {
    public TokenExpiredException() {
        super("TOKEN_EXPIRED", "Authentication token has expired", HttpStatus.UNAUTHORIZED);
    }

    public TokenExpiredException(String message) {
        super("TOKEN_EXPIRED", message, HttpStatus.UNAUTHORIZED);
    }
}
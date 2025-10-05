package org.ha.apigateway.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public abstract class AuthenticationException extends RuntimeException {
    private final String code;
    private final HttpStatus status;

    protected AuthenticationException(String code, String message, HttpStatus status) {
        super(message);
        this.code = code;
        this.status = status;
    }

}
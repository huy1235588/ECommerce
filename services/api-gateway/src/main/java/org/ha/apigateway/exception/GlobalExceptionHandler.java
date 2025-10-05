package org.ha.apigateway.exception;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.ha.apigateway.dto.ErrorResponse;
import org.springframework.boot.web.reactive.error.ErrorWebExceptionHandler;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.time.Instant;

@Slf4j
@Component
@Order(-2) // Higher priority than default error handler
public class GlobalExceptionHandler implements ErrorWebExceptionHandler {

    private final ObjectMapper objectMapper;

    public GlobalExceptionHandler(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    @NonNull
    public Mono<Void> handle(@NonNull ServerWebExchange exchange, @NonNull Throwable ex) {
        HttpStatus status;
        String code;
        String message;

        if (ex instanceof AuthenticationException authEx) {
            status = authEx.getStatus();
            code = authEx.getCode();
            message = authEx.getMessage();

            log.warn("Authentication error: {} - {}", code, message);
        } else if (ex instanceof org.springframework.security.access.AccessDeniedException) {
            status = HttpStatus.FORBIDDEN;
            code = "ACCESS_DENIED";
            message = "Access denied";

            log.warn("Access denied: {}", message);
        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            code = "INTERNAL_SERVER_ERROR";
            message = "An unexpected error occurred";

            log.error("Unexpected error", ex);
        }

        return buildErrorResponse(exchange, status, code, message);
    }

    private Mono<Void> buildErrorResponse(
            ServerWebExchange exchange,
            HttpStatus status,
            String code,
            String message
    ) {
        exchange.getResponse().setStatusCode(status);
        exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);

        // Build error response using ErrorResponse DTO
        ErrorResponse.ErrorInfo errorInfo = ErrorResponse.ErrorInfo.builder()
                .code(code)
                .message(message)
                .build();
        ErrorResponse errorResponse = ErrorResponse.builder()
                .success(false)
                .error(errorInfo)
                .timestamp(Instant.now())
                .path(exchange.getRequest().getPath().value())
                .traceId(exchange.getRequest().getId())
                .build();

        byte[] bytes;
        try {
            bytes = objectMapper.writeValueAsBytes(errorResponse);
        } catch (JsonProcessingException e) {
            log.error("Error serializing error response", e);
            bytes = "{\"error\":\"Internal Server Error\"}".getBytes(StandardCharsets.UTF_8);
        }

        DataBuffer buffer = exchange.getResponse().bufferFactory().wrap(bytes);
        return exchange.getResponse().writeWith(Mono.just(buffer));
    }
}

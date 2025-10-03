package org.ha.commons.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;
import java.util.Map;

@Data
@Builder
@EqualsAndHashCode(callSuper = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse extends ApiResponse {
    private ErrorDetail error;

    @Builder
    public ErrorResponse(ErrorDetail error) {
        super(false);
        this.error = error;
    }

    @Data
    @Builder
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ErrorDetail {
        private String code;
        private String message;
        private List<FieldError> details;
        private Map<String, Object> metadata;
    }

    @Data
    @Builder
    public static class FieldError {
        private String field;
        private String message;
        private Object rejectedValue;
    }

    // Static factory methods
    public static ErrorResponse of(String code, String message) {
        return ErrorResponse.builder()
                .error(ErrorDetail.builder()
                        .code(code)
                        .message(message)
                        .build())
                .build();
    }

    public static ErrorResponse of(String code, String message, List<FieldError> details) {
        return ErrorResponse.builder()
                .error(ErrorDetail.builder()
                        .code(code)
                        .message(message)
                        .details(details)
                        .build())
                .build();
    }
}

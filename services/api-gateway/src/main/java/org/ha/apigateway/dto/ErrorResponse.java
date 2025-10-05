package org.ha.apigateway.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.time.Instant;
import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {
    private boolean success;
    private ErrorInfo error;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
    private Instant timestamp;

    private String traceId;
    private String path;

    @Setter
    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class ErrorInfo {
        private String code;
        private String message;
        private List<ErrorDetail> details;
    }

    @Setter
    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class ErrorDetail {
        private String field;
        private String code;
        private String message;
    }
}
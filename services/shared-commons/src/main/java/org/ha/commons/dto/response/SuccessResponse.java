package org.ha.commons.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.Builder;
import lombok.EqualsAndHashCode;

@Data
@Builder
@EqualsAndHashCode(callSuper = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SuccessResponse<T> extends ApiResponse {
    private T data;
    private String message;

    // Static factory methods
    public static <T> SuccessResponse<T> of(T data) {
        return SuccessResponse.<T>builder()
                .data(data)
                .build();
    }

    public static <T> SuccessResponse<T> of(T data, String message) {
        return SuccessResponse.<T>builder()
                .data(data)
                .message(message)
                .build();
    }

    public static SuccessResponse<Void> empty() {
        return SuccessResponse.<Void>builder().build();
    }

    public static SuccessResponse<Void> withMessage(String message) {
        return SuccessResponse.<Void>builder()
                .message(message)
                .build();
    }
}

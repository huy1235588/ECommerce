package org.ha.commons.dto.response;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public abstract class ApiResponse {
    protected boolean success;
    protected Instant timestamp;
    protected String traceId;
    protected String path;

    protected ApiResponse() {
        this.success = true; // default for success responses
        this.timestamp = Instant.now();
    }

    protected ApiResponse(boolean success) {
        this.success = success;
        this.timestamp = Instant.now();
    }
}

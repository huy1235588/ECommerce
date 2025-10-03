package org.ha.commons.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class PaginationRequest {
    @Min(value = 0, message = "Page must be greater than or equal to 0")
    @Builder.Default
    private Integer page = 0;

    @Min(value = 1, message = "Size must be greater than 0")
    @Max(value = 100, message = "Size must be less than or equal to 100")
    @Builder.Default
    private Integer size = 20;

    @Builder.Default
    private String sort = "createdAt";

    @Builder.Default
    private String direction = "DESC"; // ASC or DESC

    // Helper methods
    public int getOffset() {
        return page * size;
    }

    public boolean isAscending() {
        return "ASC".equalsIgnoreCase(direction);
    }
}

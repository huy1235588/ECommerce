package org.ha.commons.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class SearchRequest extends PaginationRequest {
    @NotBlank(message = "Search query is required")
    @Size(min = 2, max = 100, message = "Search query must be between 2 and 100 characters")
    private String query;

    private List<String> fields; // Fields to search in

    private List<String> filters; // Additional filters

    public SearchRequest(
            Integer page,
            Integer size,
            String sort,
            String direction,
            String query,
            List<String> fields,
            List<String> filters
    ) {
        super(page, size, sort, direction);
        this.query = query;
        this.fields = fields;
        this.filters = filters;
    }
}

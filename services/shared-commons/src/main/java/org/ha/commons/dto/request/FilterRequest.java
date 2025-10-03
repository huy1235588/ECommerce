package org.ha.commons.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FilterRequest {
    @Builder.Default
    private List<FilterCriteria> filters = new ArrayList<>();

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FilterCriteria {
        private String field;      // Field name
        private String operator;   // eq, ne, gt, gte, lt, lte, like, in
        private Object value;      // Value to filter
    }

    // Helper methods
    public void addFilter(String field, String operator, Object value) {
        filters.add(FilterCriteria.builder()
                .field(field)
                .operator(operator)
                .value(value)
                .build());
    }

    public FilterCriteria getFilter(String field) {
        return filters.stream()
                .filter(f -> f.getField().equals(field))
                .findFirst()
                .orElse(null);
    }
}

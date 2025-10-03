package org.ha.commons.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Data
@Builder
@EqualsAndHashCode(callSuper = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PageResponse<T> extends ApiResponse {
    private List<T> data;
    private PageMetadata pagination;

    @Builder
    public PageResponse(List<T> data, PageMetadata pagination) {
        super(true);
        this.data = data;
        this.pagination = pagination;
    }

    @Data
    @Builder
    public static class PageMetadata {
        private int page;           // Current page (0-indexed)
        private int size;           // Page size
        private long totalElements; // Total items
        private int totalPages;     // Total pages
        private boolean hasNext;    // Has next page
        private boolean hasPrevious; // Has previous page
    }

    // Static factory method
    public static <T> PageResponse<T> of(
            List<T> data,
            int page,
            int size,
            long totalElements) {

        int totalPages = (int) Math.ceil((double) totalElements / size);

        return PageResponse.<T>builder()
                .data(data)
                .pagination(PageMetadata.builder()
                        .page(page)
                        .size(size)
                        .totalElements(totalElements)
                        .totalPages(totalPages)
                        .hasNext(page < totalPages - 1)
                        .hasPrevious(page > 0)
                        .build())
                .build();
    }
}

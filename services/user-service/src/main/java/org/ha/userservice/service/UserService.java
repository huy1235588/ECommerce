package org.ha.userservice.service;

import org.ha.commons.dto.request.SearchRequest;
import org.ha.commons.dto.response.PageResponse;
import org.ha.userservice.dto.response.UserWithProfileDto;

public interface UserService {

    /**
     * Retrieve a paginated list of users.
     *
     * @param searchRequest pagination and sorting information
     * @return PageResponse containing a list of users and pagination metadata
     */
    PageResponse<UserWithProfileDto> getAllUsers(SearchRequest searchRequest);
}

package org.ha.userservice.service;

import org.ha.commons.dto.request.SearchRequest;
import org.ha.commons.dto.response.PageResponse;
import org.ha.userservice.dto.response.UserResponse;

public interface UserService {

    /**
     * Retrieve a paginated list of users.
     *
     * @param searchRequest pagination and sorting information
     * @return PageResponse containing a list of users and pagination metadata
     */
    PageResponse<UserResponse> getAllUsers(SearchRequest searchRequest);

    /**
     * Retrieve a user by their unique identifier.
     *
     * @param id the unique identifier of the user
     * @return UserWithProfileDto containing user details
     */
    UserResponse getUserById(String id);

    /**
     * Delete a user by their unique identifier.
     *
     * @param id the unique identifier of the user to be deleted
     */
    void deleteUser(String id);
}

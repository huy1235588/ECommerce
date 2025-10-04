package org.ha.userservice.controller;

import lombok.RequiredArgsConstructor;
import org.ha.commons.dto.request.SearchRequest;
import org.ha.commons.dto.response.ApiResponse;
import org.ha.commons.dto.response.SuccessResponse;
import org.ha.userservice.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * Get all users with pagination.
     *
     * @param paginationRequest the pagination request containing page number and size
     * @return ApiResponse containing paginated list of users
     */
    @GetMapping("/")
    public ApiResponse getAllUsers(
            SearchRequest paginationRequest
    ) {
        return SuccessResponse.builder()
                .data(userService.getAllUsers(paginationRequest))
                .message("Get all users successfully")
                .build();
    }
}

package org.ha.userservice.controller;

import lombok.RequiredArgsConstructor;
import org.ha.commons.dto.request.SearchRequest;
import org.ha.commons.dto.response.ApiResponse;
import org.ha.commons.dto.response.ErrorResponse;
import org.ha.commons.dto.response.SuccessResponse;
import org.ha.userservice.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<ApiResponse> getAllUsers(
            SearchRequest paginationRequest
    ) {
        return ResponseEntity.ok()
                .body(SuccessResponse.builder()
                        .data(userService.getAllUsers(paginationRequest))
                        .message("Get all users successfully")
                        .build());
    }

    /**
     * Get user by ID.
     *
     * @param id the ID of the user
     * @return ApiResponse containing user details
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getUserById(@PathVariable String id) {
        return ResponseEntity.ok()
                .body(SuccessResponse.builder()
                        .data(userService.getUserById(id))
                        .message("Get user by id successfully")
                        .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteUser(
            @PathVariable String id,
            @RequestHeader("X-USER-ROLES") String roles
    ) {
        // Check if user has ADMIN role
        if (roles == null || !roles.contains("ADMIN")) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(ErrorResponse.of(
                            "AUTHZ_FORBIDDEN",
                            "You do not have permission to delete user"
                    ));
        }

        // Proceed to delete user
        userService.deleteUser(id);

        return ResponseEntity
                .ok()
                .body(SuccessResponse.withMessage("User deleted successfully"));
    }
}

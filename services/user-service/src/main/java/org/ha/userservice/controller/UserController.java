package org.ha.userservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ha.commons.dto.request.PaginationRequest;
import org.ha.commons.dto.response.ApiResponse;
import org.ha.commons.dto.response.ErrorResponse;
import org.ha.commons.dto.response.SuccessResponse;
import org.ha.userservice.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
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
    @GetMapping
    public ResponseEntity<ApiResponse> getAllUsers(
            @Valid @ModelAttribute PaginationRequest paginationRequest,
            @RequestHeader("X-USER-ROLES") String roles
    ) {
        log.info("Received request to get all users with pagination: {}", paginationRequest);

        // Check if user has ADMIN role
        if (roles == null || !roles.contains("ADMIN")) {
            log.info("User with roles {} attempted to access admin resource", roles);
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(ErrorResponse.of(
                            "AUTHZ_FORBIDDEN",
                            "You do not have permission to access this resource"
                    ));
        }

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

package org.ha.userservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.ha.commons.dto.response.ApiResponse;
import org.ha.commons.dto.response.SuccessResponse;
import org.ha.userservice.dto.request.RegisterRequest;
import org.ha.userservice.dto.response.UserResponse;
import org.ha.userservice.service.AuthService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * Endpoint for user registration.
     * Registers a new user and returns the user details.
     *
     * @param registerRequest The registration request containing user details.
     * @return ApiResponse containing UserResponse with registered user details.
     */
    @PostMapping("/register")
    public ApiResponse register(
            @Valid @RequestBody RegisterRequest registerRequest
    ) {
        UserResponse userResponse = authService.register(registerRequest);

        return SuccessResponse.of(userResponse, "User registered successfully");
    }
}

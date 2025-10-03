package org.ha.userservice.controller;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.ha.commons.dto.response.ApiResponse;
import org.ha.commons.dto.response.SuccessResponse;
import org.ha.userservice.dto.request.RegisterRequest;
import org.ha.userservice.dto.request.LoginRequest;
import org.ha.userservice.dto.response.UserResponse;
import org.ha.userservice.dto.response.LoginResponse;
import org.ha.userservice.service.AuthService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    @Value("${jwt.refresh-expiration}")
    private Long jwtRefreshExpiration;

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

    @PostMapping("/login")
    public ApiResponse login(
            @Valid @RequestBody LoginRequest loginRequest,
            HttpServletResponse response
    ) {
        LoginResponse resp = authService.login(loginRequest);

        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", resp.getRefreshToken())
                .path("/")
                .maxAge(loginRequest.getRememberMe() ? 7 * 24 * 60 * 60 : jwtRefreshExpiration / 1000) // 7 days or default
                .httpOnly(true)
                .secure(true)
                .sameSite("Lax")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        return SuccessResponse.of(resp, "Login successful");
    }
}

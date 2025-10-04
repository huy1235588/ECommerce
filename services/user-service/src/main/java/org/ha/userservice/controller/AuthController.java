package org.ha.userservice.controller;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
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
import org.springframework.web.bind.annotation.*;

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

    /**
     * Endpoint for user login.
     * Authenticates the user and returns access and refresh tokens.
     * The refresh token is set in an HttpOnly cookie.
     *
     * @param loginRequest The login request containing username and password.
     * @param response     The HttpServletResponse to add the refresh token cookie.
     * @return ApiResponse containing LoginResponse with access token and user details.
     */
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

    /**
     * Endpoint for refreshing the access token.
     * Uses the refresh token from the HttpOnly cookie to generate a new access token.
     *
     * @param refreshToken The refresh token from the cookie.
     * @param response     The HttpServletResponse to add the new refresh token cookie.
     * @return ApiResponse containing the new access token.
     */
    @PostMapping("/refresh")
    public ApiResponse refreshToken(
            @NotNull(message = "Refresh token is required") @CookieValue("refreshToken") String refreshToken,
            HttpServletResponse response
    ) {
        String resp = authService.refreshToken(refreshToken);

        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", resp)
                .path("/")
                .maxAge(jwtRefreshExpiration / 1000) // default expiration
                .httpOnly(true)
                .secure(true)
                .sameSite("Lax")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        return SuccessResponse.of(resp, "Token refreshed successfully");
    }

    /**
     * Endpoint for user logout.
     * Invalidates the refresh token cookie.
     *
     * @param response The HttpServletResponse to remove the refresh token cookie.
     * @return ApiResponse indicating successful logout.
     */
    @PostMapping("/logout")
    public ApiResponse logout(HttpServletResponse response) {
        // Invalidate the refresh token cookie
        ResponseCookie deleteCookie = ResponseCookie.from("refreshToken", "")
                .path("/")
                .maxAge(0)
                .httpOnly(true)
                .secure(true)
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, deleteCookie.toString());

        return SuccessResponse.withMessage("Logout successful");
    }
}

package org.ha.userservice.service;

import org.ha.userservice.dto.request.LoginRequest;
import org.ha.userservice.dto.request.RegisterRequest;
import org.ha.userservice.dto.response.LoginResponse;
import org.ha.userservice.dto.response.UserResponse;

public interface AuthService {
    /**
     * Register a new user.
     *
     * @param user registration details
     * @return UserResponse containing user info
     */
    UserResponse register(RegisterRequest user);

    /**
     * Authenticate a user and create a session token.
     *
     * @param loginRequest credentials
     * @return LoginResponse containing session token and user info
     */
    LoginResponse login(LoginRequest loginRequest);
}

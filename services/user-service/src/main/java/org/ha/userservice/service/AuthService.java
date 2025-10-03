package org.ha.userservice.service;

import org.ha.userservice.dto.request.RegisterRequest;
import org.ha.userservice.dto.response.UserResponse;

public interface AuthService {
    UserResponse register(RegisterRequest user);
}

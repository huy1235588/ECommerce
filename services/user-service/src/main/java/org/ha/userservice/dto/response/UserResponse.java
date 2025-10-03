package org.ha.userservice.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {
    private String id;
    private String email;
    private String username;
    private String firstName;
    private String lastName;
    private String avatarUrl;
    private String status;
    private String role;
    private Boolean emailVerified;
    private String birthDate;
    private String country;
    private String createdAt;
    private String updatedAt;
    private String lastLoginAt;
}

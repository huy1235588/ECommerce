package org.ha.userservice.dto.response;

import lombok.*;
import org.ha.userservice.model.entity.Role;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserWithProfileDto {
    private UUID id;
    private String email;
    private String username;
    private String firstName;
    private String lastName;
    private String avatarUrl;
    private String status;
    private Boolean emailVerified;
    private LocalDate birthDate;
    private String country;
    private Instant createdAt;
    private Instant updatedAt;
    private Instant lastLoginAt;
}
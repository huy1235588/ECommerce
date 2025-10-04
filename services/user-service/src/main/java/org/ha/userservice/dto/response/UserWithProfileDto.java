package org.ha.userservice.dto.response;

import lombok.*;
import org.ha.userservice.model.entity.Role;
import org.ha.userservice.model.entity.User;
import org.ha.userservice.model.entity.UserProfile;

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
    private Set<Role> roles;

    public UserWithProfileDto(User user, UserProfile profile) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.username = user.getUsername();
        this.firstName = profile.getFirstName();
        this.lastName = profile.getLastName();
        this.avatarUrl = profile.getAvatarUrl();
        this.status = user.getStatus();
        this.emailVerified = user.getEmailVerified();
        this.birthDate = profile.getBirthDate();
        this.country = profile.getCountry();
        this.createdAt = user.getCreatedAt();
        this.updatedAt = user.getUpdatedAt();
        this.lastLoginAt = user.getLastLoginAt();
        this.roles = user.getRoles();
    }
}
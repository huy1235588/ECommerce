package org.ha.userservice.service.impl;

import lombok.RequiredArgsConstructor;
import org.ha.commons.exception.ResourceAlreadyExistsException;
import org.ha.userservice.dto.request.RegisterRequest;
import org.ha.userservice.dto.response.UserResponse;
import org.ha.userservice.model.entity.User;
import org.ha.userservice.model.entity.UserProfile;
import org.ha.userservice.repository.UserProfileRepository;
import org.ha.userservice.repository.UserRepository;
import org.ha.userservice.service.AuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final PasswordEncoder passwordEncoder;

    //===============================================================
    //
    //  Basic CRUD methods
    //
    //===============================================================

    //===============================================================
    //
    //  Business logic methods
    //
    //===============================================================

    @Override
    @Transactional
    public UserResponse register(RegisterRequest userRequest) {
        // check email
        if (userRepository.findByEmail(userRequest.getEmail()).isPresent()) {
            throw ResourceAlreadyExistsException.of("User", "email", userRequest.getEmail());
        }

        if (userRepository.findByUsername(userRequest.getUsername()).isPresent()) {
            throw ResourceAlreadyExistsException.of("User", "username", userRequest.getUsername());
        }

        // create user
        User user = User.builder()
                .id(UUID.randomUUID())
                .username(userRequest.getUsername())
                .email(userRequest.getEmail())
                .password(userRequest.getPassword())
                .build();
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        UserProfile profile = UserProfile.builder()
                .id(UUID.randomUUID())
                .userId(user.getId())
                .firstName(userRequest.getFirstName())
                .lastName(userRequest.getLastName())
                .build();

        // save user and profile
        User savedUser = userRepository.save(user);
        UserProfile savedProfile = userProfileRepository.save(profile);

        // prepare response
        return UserResponse.builder()
                .id(savedUser.getId().toString())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .firstName(savedProfile.getFirstName())
                .lastName(savedProfile.getLastName())
                .avatarUrl(savedProfile.getAvatarUrl())
                .status(savedUser.getStatus())
                .role(savedUser.getRole())
                .emailVerified(savedUser.getEmailVerified())
                .birthDate(savedProfile.getBirthDate() != null ? savedProfile.getBirthDate().toString() : null)
                .country(savedProfile.getCountry())
                .createdAt(savedUser.getCreatedAt().toString())
                .updatedAt(savedUser.getUpdatedAt().toString())
                .lastLoginAt(savedUser.getLastLoginAt() != null ? savedUser.getLastLoginAt().toString() : null)
                .build();
    }

    //===============================================================
    //
    //  Helper methods
    //
    //===============================================================
}

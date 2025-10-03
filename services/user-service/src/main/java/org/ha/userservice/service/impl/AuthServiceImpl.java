package org.ha.userservice.service.impl;

import lombok.RequiredArgsConstructor;
import org.ha.commons.exception.ResourceAlreadyExistsException;
import org.ha.commons.exception.BusinessException;
import org.ha.userservice.dto.request.RegisterRequest;
import org.ha.userservice.dto.request.LoginRequest;
import org.ha.userservice.dto.response.UserResponse;
import org.ha.userservice.dto.response.LoginResponse;
import org.ha.userservice.model.entity.*;
import org.ha.userservice.repository.*;
import org.ha.userservice.security.CustomUserDetails;
import org.ha.userservice.security.JwtUtil;
import org.ha.userservice.service.AuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

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

        Role role = roleRepository.findByName("CUSTOMER").orElseThrow();
        UserRole userRole = UserRole.builder()
                .id(UUID.randomUUID())
                .user(user)
                .role(role)
                .build();

        // save user and profile
        User savedUser = userRepository.save(user);
        UserProfile savedProfile = userProfileRepository.save(profile);
        UserRole savedUserRole = userRoleRepository.save(userRole);

        // prepare response
        return UserResponse.builder()
                .id(savedUser.getId().toString())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .firstName(savedProfile.getFirstName())
                .lastName(savedProfile.getLastName())
                .avatarUrl(savedProfile.getAvatarUrl())
                .status(savedUser.getStatus())
                .roles(List.of(savedUserRole.getRole().getName()))
                .emailVerified(savedUser.getEmailVerified())
                .birthDate(savedProfile.getBirthDate() != null ? savedProfile.getBirthDate().toString() : null)
                .country(savedProfile.getCountry())
                .createdAt(savedUser.getCreatedAt().toString())
                .updatedAt(savedUser.getUpdatedAt().toString())
                .lastLoginAt(savedUser.getLastLoginAt() != null ? savedUser.getLastLoginAt().toString() : null)
                .build();
    }

    @Override
    @Transactional
    public LoginResponse login(LoginRequest loginRequest) {
        try {
            // authenticate user
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsernameOrEmail(),
                            loginRequest.getPassword()
                    )
            );

            // auth successful
            CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();

            // roles
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(grantedAuthority -> grantedAuthority.getAuthority().replace("ROLE_", ""))
                    .toList();

            // get user
            User user = userRepository.findById(userDetails.user().getId())
                    .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "User not found"));

            // update last login and save
            user.markLastLogin();
            userRepository.save(user);

            // create user access token
            String accessToken = jwtUtil.generateToken(
                    user.getUsername(),
                    user.getId().toString(),
                    roles
            );
            // create refresh token
            String refreshToken = jwtUtil.generateRefreshToken(
                    user.getUsername(),
                    user.getId().toString(),
                    roles
            );

            // create response object
            UserResponse userResp = UserResponse.builder()
                    .id(user.getId().toString())
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .firstName(null)
                    .lastName(null)
                    .avatarUrl(null)
                    .status(user.getStatus())
                    .roles(roles)
                    .emailVerified(user.getEmailVerified())
                    .birthDate(null)
                    .country(null)
                    .createdAt(user.getCreatedAt().toString())
                    .updatedAt(user.getUpdatedAt() != null ? user.getUpdatedAt().toString() : null)
                    .lastLoginAt(user.getLastLoginAt() != null ? user.getLastLoginAt().toString() : null)
                    .build();

            return LoginResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .tokenType("Bearer")
                    .expiresIn(jwtUtil.getExpiration() / 1000) // in
                    .user(userResp)
                    .build();

        } catch (AuthenticationException ex) {
            throw new BusinessException("AUTH_FAILED", "Invalid credentials");
        }
    }

    //===============================================================
    //
    //  Helper methods
    //
    //===============================================================
}

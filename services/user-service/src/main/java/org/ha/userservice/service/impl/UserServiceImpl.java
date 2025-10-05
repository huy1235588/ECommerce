package org.ha.userservice.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ha.commons.dto.request.PaginationRequest;
import org.ha.commons.dto.response.PageResponse;
import org.ha.commons.exception.ResourceNotFoundException;
import org.ha.userservice.dto.response.UserResponse;
import org.ha.userservice.model.entity.User;
import org.ha.userservice.model.view.UserWithProfileView;
import org.ha.userservice.repository.UserRepository;
import org.ha.userservice.repository.UserWithProfileViewRepository;
import org.ha.userservice.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserWithProfileViewRepository userWithProfileViewRepository;

    //===============================================================
    //
    //  Basic CRUD methods
    //
    //===============================================================

    // Lấy tất cả user với phân trang
    public Page<User> getAllUsersInternal(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return userRepository.findAll(pageable);
    }

    // Lấy user theo id
    public User getUserByIdInternal(String id) {
        return userRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    // Lấy tất cả user với proffle
    public Page<UserWithProfileView> getAllUsersWithProfileInternal(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return userWithProfileViewRepository.findAll(pageable);
    }

    // Lấy user với profile theo id
    public UserWithProfileView getUserByIdWithProfileInternal(String id) {
        return userWithProfileViewRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    //===============================================================
    //
    //  Business logic methods
    //
    //===============================================================

    @Override
    public PageResponse<UserResponse> getAllUsers(PaginationRequest paginationRequest) {

        Page<UserWithProfileView> page = getAllUsersWithProfileInternal(paginationRequest.getPage(), paginationRequest.getSize());

        Page<UserResponse> responsePage = page.map(this::mapToUserResponse);

        return PageResponse.of(
                responsePage.getContent(),
                responsePage.getNumber(),
                responsePage.getSize(),
                responsePage.getTotalElements()
        );
    }

    @Override
    public UserResponse getUserById(String id) {
        UserWithProfileView userWithProfileView = getUserByIdWithProfileInternal(id);
        return mapToUserResponse(userWithProfileView);
    }

    @Override
    public void deleteUser(String id) {
        User user = getUserByIdInternal(id);
        userRepository.delete(user);
    }

    //===============================================================
    //
    //  Helper methods
    //
    //===============================================================

    // Map UserWithProfileView entity to UserResponse DTO
    private UserResponse mapToUserResponse(UserWithProfileView userWithProfileView) {
        return UserResponse.builder()
                .id(userWithProfileView.getId().toString())
                .email(userWithProfileView.getEmail())
                .username(userWithProfileView.getUsername())
                .firstName(userWithProfileView.getFirstName())
                .lastName(userWithProfileView.getLastName())
                .avatarUrl(userWithProfileView.getAvatarUrl())
                .status(userWithProfileView.getStatus())
                .roles(userWithProfileView.getRoles())
                .emailVerified(userWithProfileView.getEmailVerified())
                .birthDate(userWithProfileView.getBirthDate() != null ? userWithProfileView.getBirthDate().toString() : null)
                .country(userWithProfileView.getCountry())
                .createdAt(userWithProfileView.getCreatedAt() != null ? userWithProfileView.getCreatedAt().toString() : null)
                .updatedAt(userWithProfileView.getUpdatedAt() != null ? userWithProfileView.getUpdatedAt().toString() : null)
                .lastLoginAt(userWithProfileView.getLastLoginAt() != null ? userWithProfileView.getLastLoginAt().toString() : null)
                .build();
    }
}

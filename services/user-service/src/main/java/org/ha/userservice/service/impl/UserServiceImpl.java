package org.ha.userservice.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ha.commons.dto.request.SearchRequest;
import org.ha.commons.dto.response.PageResponse;
import org.ha.userservice.dto.response.UserResponse;
import org.ha.userservice.dto.response.UserWithProfileDto;
import org.ha.userservice.model.entity.User;
import org.ha.userservice.repository.UserRepository;
import org.ha.userservice.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    //===============================================================
    //
    //  Basic CRUD methods
    //
    //===============================================================

    // Lấy tất cả user với phân trang
    public Page<User> getAllUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return userRepository.findAll(pageable);
    }

    // Lấy tất cả user với proffle
    public Page<UserWithProfileDto> getAllUsersWithProfile(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<UserWithProfileDto> result = userRepository.findAllWithProfile(pageable);
        log.info("Result of findAllWithProfile: totalElements={}, totalPages={}, currentPage={}, pageSize={}, content={}",
                 result.getTotalElements(), result.getTotalPages(), result.getNumber(), result.getSize(), result.getContent());
        return result;
    }

    //===============================================================
    //
    //  Business logic methods
    //
    //===============================================================

    @Override
    public PageResponse<UserWithProfileDto> getAllUsers(SearchRequest searchRequest) {

        Page<UserWithProfileDto> page = getAllUsersWithProfile(searchRequest.getPage(), searchRequest.getSize());

        Page<UserResponse> userResponses = page.map(userWithProfileDto -> UserResponse.builder()
                .id(userWithProfileDto.getId().toString())
                .email(userWithProfileDto.getEmail())
                .username(userWithProfileDto.getUsername())
                .firstName(userWithProfileDto.getFirstName())
                .lastName(userWithProfileDto.getLastName())
                .avatarUrl(userWithProfileDto.getAvatarUrl())
                .status(userWithProfileDto.getStatus())
//                .roles(userWithProfileDto.getRoles() != null ? userWithProfileDto.getRoles().stream().map(Object::toString).toList() : Collections.emptyList())
                .emailVerified(userWithProfileDto.getEmailVerified())
                .birthDate(userWithProfileDto.getBirthDate() != null ? userWithProfileDto.getBirthDate().toString() : null)
                .country(userWithProfileDto.getCountry())
                .createdAt(userWithProfileDto.getCreatedAt() != null ? userWithProfileDto.getCreatedAt().toString() : null)
                .updatedAt(userWithProfileDto.getUpdatedAt() != null ? userWithProfileDto.getUpdatedAt().toString() : null)
                .lastLoginAt(userWithProfileDto.getLastLoginAt() != null ? userWithProfileDto.getLastLoginAt().toString() : null)
                .build());

        return PageResponse.of(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements()
        );
    }

    //===============================================================
    //
    //  Helper methods
    //
    //===============================================================
}

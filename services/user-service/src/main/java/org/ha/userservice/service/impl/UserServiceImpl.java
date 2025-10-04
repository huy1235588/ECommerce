package org.ha.userservice.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ha.commons.dto.request.SearchRequest;
import org.ha.commons.dto.response.PageResponse;
import org.ha.commons.exception.ResourceNotFoundException;
import org.ha.userservice.dto.response.UserWithProfileDto;
import org.ha.userservice.model.entity.User;
import org.ha.userservice.repository.UserRepository;
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

    // Lấy tất cả user với proffle
    public Page<UserWithProfileDto> getAllUsersWithProfileInternal(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<UserWithProfileDto> result = userRepository.findAllWithProfile(pageable);
        log.info("Result of findAllWithProfile: totalElements={}, totalPages={}, currentPage={}, pageSize={}, content={}",
                result.getTotalElements(), result.getTotalPages(), result.getNumber(), result.getSize(), result.getContent());
        return result;
    }

    // Lấy user theo id
    public User getUserByIdInternal(String id) {
        return userRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    // Lấy user với profile theo id
    public UserWithProfileDto getUserByIdWithProfileInternal(String id) {
        return userRepository.findByIdWithProfile(UUID.fromString(id))
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    //===============================================================
    //
    //  Business logic methods
    //
    //===============================================================

    @Override
    public PageResponse<UserWithProfileDto> getAllUsers(SearchRequest searchRequest) {

        Page<UserWithProfileDto> page = getAllUsersWithProfileInternal(searchRequest.getPage(), searchRequest.getSize());

        return PageResponse.of(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements()
        );
    }

    @Override
    public UserWithProfileDto getUserById(String id) {
        return getUserByIdWithProfileInternal(id);
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
}

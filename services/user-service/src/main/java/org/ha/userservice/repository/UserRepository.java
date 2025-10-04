package org.ha.userservice.repository;

import org.ha.userservice.dto.response.UserWithProfileDto;
import org.ha.userservice.model.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    @Query("""
            SELECT new org.ha.userservice.dto.response.UserWithProfileDto(u, up)
            FROM User u
            LEFT JOIN FETCH u.roles
            JOIN UserProfile up ON u.id = up.userId
            """)
    Page<UserWithProfileDto> findAllWithProfile(Pageable pageable);

    @Query("""
            SELECT new org.ha.userservice.dto.response.UserWithProfileDto(u, up)
            FROM User u
            LEFT JOIN FETCH u.roles
            JOIN UserProfile up ON u.id = up.userId
            WHERE u.id = :id
            """)
    Optional<UserWithProfileDto> findByIdWithProfile(UUID id);
}

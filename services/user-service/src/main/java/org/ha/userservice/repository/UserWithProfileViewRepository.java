package org.ha.userservice.repository;

import org.ha.userservice.model.view.UserWithProfileView;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserWithProfileViewRepository extends JpaRepository<UserWithProfileView, UUID> {
    Page<UserWithProfileView> findAll(Pageable pageable);

    Optional<UserWithProfileView> findById(UUID id);
}

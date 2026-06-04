package com.portfolio.backend.employer.repository;

import com.portfolio.backend.employer.entity.EmployerProfile;
import com.portfolio.backend.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface EmployerProfileRepository extends JpaRepository<EmployerProfile, UUID> {

    Optional<EmployerProfile> findByUser(User user);

    boolean existsByUser(User user);
}

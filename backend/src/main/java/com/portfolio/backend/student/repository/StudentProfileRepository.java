package com.portfolio.backend.student.repository;

import com.portfolio.backend.student.entity.StudentProfile;
import com.portfolio.backend.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface StudentProfileRepository extends JpaRepository<StudentProfile, UUID> {

    Optional<StudentProfile> findByUser(User user);

    boolean existsByUser(User user);
}
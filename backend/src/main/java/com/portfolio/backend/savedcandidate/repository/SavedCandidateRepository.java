package com.portfolio.backend.savedcandidate.repository;

import com.portfolio.backend.employer.entity.EmployerProfile;
import com.portfolio.backend.savedcandidate.entity.SavedCandidate;
import com.portfolio.backend.student.entity.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SavedCandidateRepository extends JpaRepository<SavedCandidate, UUID> {

    List<SavedCandidate> findByEmployerProfileOrderBySavedAtDesc(
            EmployerProfile employerProfile
    );

    boolean existsByEmployerProfileAndStudentProfile(
            EmployerProfile employerProfile,
            StudentProfile studentProfile
    );

    Optional<SavedCandidate> findByEmployerProfileAndStudentProfile(
            EmployerProfile employerProfile,
            StudentProfile studentProfile
    );
}
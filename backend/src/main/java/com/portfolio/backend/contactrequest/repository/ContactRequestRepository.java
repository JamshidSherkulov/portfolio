package com.portfolio.backend.contactrequest.repository;

import com.portfolio.backend.contactrequest.entity.ContactRequest;
import com.portfolio.backend.employer.entity.EmployerProfile;
import com.portfolio.backend.student.entity.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ContactRequestRepository extends JpaRepository<ContactRequest, UUID> {

    List<ContactRequest> findByEmployerProfileOrderByRequestedAtDesc(
            EmployerProfile employerProfile
    );

    List<ContactRequest> findByStudentProfileOrderByRequestedAtDesc(
            StudentProfile studentProfile
    );

    boolean existsByEmployerProfileAndStudentProfile(
            EmployerProfile employerProfile,
            StudentProfile studentProfile
    );

    Optional<ContactRequest> findByEmployerProfileAndStudentProfile(
            EmployerProfile employerProfile,
            StudentProfile studentProfile
    );
}
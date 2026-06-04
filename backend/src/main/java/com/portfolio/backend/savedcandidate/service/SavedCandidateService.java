package com.portfolio.backend.savedcandidate.service;

import com.portfolio.backend.common.exception.ResourceNotFoundException;
import com.portfolio.backend.employer.entity.EmployerProfile;
import com.portfolio.backend.employer.repository.EmployerProfileRepository;
import com.portfolio.backend.project.repository.ProjectRepository;
import com.portfolio.backend.savedcandidate.dto.SavedCandidateResponse;
import com.portfolio.backend.savedcandidate.entity.SavedCandidate;
import com.portfolio.backend.savedcandidate.repository.SavedCandidateRepository;
import com.portfolio.backend.student.entity.StudentProfile;
import com.portfolio.backend.student.repository.StudentProfileRepository;
import com.portfolio.backend.user.entity.Role;
import com.portfolio.backend.user.entity.User;
import com.portfolio.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SavedCandidateService {

    private final SavedCandidateRepository savedCandidateRepository;
    private final EmployerProfileRepository employerProfileRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public SavedCandidateResponse saveCandidate(
            String employerEmail,
            UUID studentProfileId
    ) {
        User user = getEmployerUser(employerEmail);

        EmployerProfile employerProfile = employerProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Employer profile not found"));

        StudentProfile studentProfile = studentProfileRepository.findById(studentProfileId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found"));

        if (savedCandidateRepository.existsByEmployerProfileAndStudentProfile(
                employerProfile,
                studentProfile
        )) {
            SavedCandidate existing = savedCandidateRepository
                    .findByEmployerProfileAndStudentProfile(employerProfile, studentProfile)
                    .orElseThrow();

            return toResponse(existing);
        }

        SavedCandidate savedCandidate = SavedCandidate.builder()
                .employerProfile(employerProfile)
                .studentProfile(studentProfile)
                .build();

        SavedCandidate saved = savedCandidateRepository.save(savedCandidate);

        return toResponse(saved);
    }

    public List<SavedCandidateResponse> getSavedCandidates(String employerEmail) {
        User user = getEmployerUser(employerEmail);

        EmployerProfile employerProfile = employerProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Employer profile not found"));

        return savedCandidateRepository
                .findByEmployerProfileOrderBySavedAtDesc(employerProfile)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public void removeSavedCandidate(
            String employerEmail,
            UUID studentProfileId
    ) {
        User user = getEmployerUser(employerEmail);

        EmployerProfile employerProfile = employerProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Employer profile not found"));

        StudentProfile studentProfile = studentProfileRepository.findById(studentProfileId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found"));

        SavedCandidate savedCandidate = savedCandidateRepository
                .findByEmployerProfileAndStudentProfile(employerProfile, studentProfile)
                .orElseThrow(() -> new ResourceNotFoundException("Saved candidate not found"));

        savedCandidateRepository.delete(savedCandidate);
    }

    private SavedCandidateResponse toResponse(SavedCandidate savedCandidate) {
        StudentProfile student = savedCandidate.getStudentProfile();

        long projectCount = projectRepository.countByStudentProfile(student);

        return new SavedCandidateResponse(
                savedCandidate.getId(),
                student.getId(),
                student.getFirstName(),
                student.getLastName(),
                student.getHeadline(),
                student.getLocation(),
                student.getPreferredRole(),
                student.getExperienceLevel(),
                student.getSkills(),
                projectCount,
                savedCandidate.getSavedAt()
        );
    }

    private User getEmployerUser(String email) {
        User user = userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() != Role.EMPLOYER) {
            throw new RuntimeException("Only employers can save candidates");
        }

        return user;
    }
}

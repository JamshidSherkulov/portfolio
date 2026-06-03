package com.portfolio.backend.candidate.service;

import com.portfolio.backend.candidate.dto.CandidateDetailResponse;
import com.portfolio.backend.candidate.dto.CandidateSummaryResponse;
import com.portfolio.backend.candidate.repository.CandidateRepository;
import com.portfolio.backend.common.exception.ResourceNotFoundException;
import com.portfolio.backend.project.mapper.ProjectMapper;
import com.portfolio.backend.project.repository.ProjectRepository;
import com.portfolio.backend.student.entity.StudentProfile;
import com.portfolio.backend.user.entity.Role;
import com.portfolio.backend.user.entity.User;
import com.portfolio.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CandidateService {

    private final CandidateRepository candidateRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public List<CandidateSummaryResponse> searchCandidates(
            String employerEmail,
            String skill,
            String location,
            String preferredRole,
            String experienceLevel
    ) {
        User employer = getUserByEmail(employerEmail);

        if (employer.getRole() != Role.EMPLOYER) {
            throw new RuntimeException("Only employers can search candidates");
        }

        return candidateRepository.searchCandidates(
                        clean(skill),
                        clean(location),
                        clean(preferredRole),
                        clean(experienceLevel)
                )
                .stream()
                .collect(java.util.stream.Collectors.toMap(
                        StudentProfile::getId,
                        profile -> profile,
                        (existing, duplicate) -> existing
                ))
                .values()
                .stream()
                .map(this::toSummaryResponse)
                .toList();
    }

    public CandidateDetailResponse getCandidateById(
            String employerEmail,
            UUID studentProfileId
    ) {
        User employer = getUserByEmail(employerEmail);

        if (employer.getRole() != Role.EMPLOYER) {
            throw new RuntimeException("Only employers can view candidate profiles");
        }

        StudentProfile profile = candidateRepository.findById(studentProfileId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found"));

        var projects = projectRepository
                .findByStudentProfileOrderByCreatedAtDesc(profile)
                .stream()
                .map(ProjectMapper::toResponse)
                .toList();

        return new CandidateDetailResponse(
                profile.getId(),
                profile.getFirstName(),
                profile.getLastName(),
                profile.getHeadline(),
                profile.getLocation(),
                profile.getBio(),
                profile.getUniversity(),
                profile.getDegree(),
                profile.getGraduationYear(),
                profile.getPreferredRole(),
                profile.getExperienceLevel(),
                profile.getAvailability(),
                profile.getGithubUrl(),
                profile.getLinkedinUrl(),
                profile.getPortfolioUrl(),
                profile.getProfileImageUrl(),
                profile.getSkills(),
                projects
        );
    }

    private CandidateSummaryResponse toSummaryResponse(StudentProfile profile) {
        long projectCount = projectRepository.countByStudentProfile(profile);

        return new CandidateSummaryResponse(
                profile.getId(),
                profile.getFirstName(),
                profile.getLastName(),
                profile.getHeadline(),
                profile.getLocation(),
                profile.getPreferredRole(),
                profile.getExperienceLevel(),
                profile.getSkills(),
                projectCount
        );
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private String clean(String value) {
        if (value == null || value.trim().isBlank()) {
            return "";
        }

        return value.trim();
    }
}
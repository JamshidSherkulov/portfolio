package com.portfolio.backend.candidate.dto;

import com.portfolio.backend.project.dto.ProjectResponse;

import java.util.List;
import java.util.UUID;

public record CandidateDetailResponse(
        UUID id,
        String firstName,
        String lastName,
        String headline,
        String location,
        String bio,
        String university,
        String degree,
        String graduationYear,
        String preferredRole,
        String experienceLevel,
        String availability,
        String githubUrl,
        String linkedinUrl,
        String portfolioUrl,
        String profileImageUrl,
        List<String> skills,
        List<ProjectResponse> projects
) {
}

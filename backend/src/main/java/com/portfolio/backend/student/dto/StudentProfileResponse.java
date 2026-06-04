package com.portfolio.backend.student.dto;

import java.util.List;
import java.util.UUID;

public record StudentProfileResponse(
        UUID id,
        UUID userId,
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
        List<String> skills
) {
}
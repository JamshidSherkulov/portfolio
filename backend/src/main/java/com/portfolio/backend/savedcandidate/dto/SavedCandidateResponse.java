package com.portfolio.backend.savedcandidate.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record SavedCandidateResponse(
        UUID savedCandidateId,
        UUID studentProfileId,
        String firstName,
        String lastName,
        String headline,
        String location,
        String preferredRole,
        String experienceLevel,
        List<String> skills,
        long projectCount,
        LocalDateTime savedAt
) {
}
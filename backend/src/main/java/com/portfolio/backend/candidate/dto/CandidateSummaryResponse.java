package com.portfolio.backend.candidate.dto;

import java.util.List;
import java.util.UUID;

public record CandidateSummaryResponse(
        UUID id,
        String firstName,
        String lastName,
        String headline,
        String location,
        String preferredRole,
        String experienceLevel,
        List<String> skills,
        long projectCount
) {
}
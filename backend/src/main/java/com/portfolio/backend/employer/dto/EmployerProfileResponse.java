package com.portfolio.backend.employer.dto;

import java.util.UUID;

public record EmployerProfileResponse(
        UUID id,
        UUID userId,
        String companyName,
        String website,
        String industry,
        String location,
        String companySize,
        String description,
        String logoUrl
) {
}

package com.portfolio.backend.contactrequest.dto;

import com.portfolio.backend.contactrequest.entity.ContactRequestStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record ContactRequestResponse(
        UUID id,

        UUID employerProfileId,
        String companyName,
        String companyWebsite,
        String companyIndustry,
        String companyLocation,

        UUID studentProfileId,
        String studentFirstName,
        String studentLastName,
        String studentHeadline,
        String studentLocation,
        String studentPreferredRole,
        List<String> studentSkills,

        String message,
        ContactRequestStatus status,
        LocalDateTime requestedAt,
        LocalDateTime updatedAt
) {
}
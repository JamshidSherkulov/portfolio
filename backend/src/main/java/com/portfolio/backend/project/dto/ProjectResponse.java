package com.portfolio.backend.project.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record ProjectResponse(
        UUID id,
        UUID studentProfileId,
        String title,
        String description,
        String proofSummary,
        List<String> techStack,
        String githubUrl,
        String liveDemoUrl,
        String imageUrl,
        String projectType,
        String status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}

package com.portfolio.backend.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record ProjectRequest(

        @NotBlank(message = "Project title is required")
        @Size(max = 140)
        String title,

        @Size(max = 1000)
        String description,

        @Size(max = 1000)
        String proofSummary,

        List<@Size(max = 80) String> techStack,

        @Size(max = 255)
        String githubUrl,

        @Size(max = 255)
        String liveDemoUrl,

        @Size(max = 255)
        String imageUrl,

        @Size(max = 120)
        String projectType,

        @Size(max = 80)
        String status
) {
}

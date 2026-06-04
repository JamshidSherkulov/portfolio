package com.portfolio.backend.employer.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record EmployerProfileRequest(

        @NotBlank(message = "Company name is required")
        @Size(max = 120)
        String companyName,

        @Size(max = 255)
        String website,

        @Size(max = 120)
        String industry,

        @Size(max = 120)
        String location,

        @Size(max = 80)
        String companySize,

        @Size(max = 1000)
        String description,

        @Size(max = 255)
        String logoUrl
) {
}

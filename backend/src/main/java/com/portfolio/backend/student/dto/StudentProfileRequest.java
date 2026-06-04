package com.portfolio.backend.student.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record StudentProfileRequest(

        @NotBlank(message = "First name is required")
        @Size(max = 80, message = "First name must be less than 80 characters")
        String firstName,

        @NotBlank(message = "Last name is required")
        @Size(max = 80, message = "Last name must be less than 80 characters")
        String lastName,

        @Size(max = 160, message = "Headline must be less than 160 characters")
        String headline,

        @Size(max = 120, message = "Location must be less than 120 characters")
        String location,

        @Size(max = 1000, message = "Bio must be less than 1000 characters")
        String bio,

        @Size(max = 120, message = "University must be less than 120 characters")
        String university,

        @Size(max = 120, message = "Degree must be less than 120 characters")
        String degree,

        @Size(max = 50, message = "Graduation year must be less than 50 characters")
        String graduationYear,

        @Size(max = 120, message = "Preferred role must be less than 120 characters")
        String preferredRole,

        @Size(max = 80, message = "Experience level must be less than 80 characters")
        String experienceLevel,

        @Size(max = 120, message = "Availability must be less than 120 characters")
        String availability,

        @Size(max = 255, message = "GitHub URL must be less than 255 characters")
        String githubUrl,

        @Size(max = 255, message = "LinkedIn URL must be less than 255 characters")
        String linkedinUrl,

        @Size(max = 255, message = "Portfolio URL must be less than 255 characters")
        String portfolioUrl,

        @Size(max = 255, message = "Profile image URL must be less than 255 characters")
        String profileImageUrl,

        List<@Size(max = 80, message = "Each skill must be less than 80 characters") String> skills

) {
}
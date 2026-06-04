package com.portfolio.backend.auth.dto;

import com.portfolio.backend.user.entity.Role;
import jakarta.validation.constraints.*;

public record RegisterRequest(
        @Email(message = "Email must be valid")
        @NotBlank(message = "Email is required")
        String email,

        @NotBlank(message = "Password is required")
        @Size(min = 8, message = "Password must be at least 8 characters")
        @Pattern(
                regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$",
                message = "Password must include at least one letter and one number"
        )
        String password,

        @NotNull(message = "Role is required")
        Role role
) {
}

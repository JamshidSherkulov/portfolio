package com.portfolio.backend.contactrequest.dto;


import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record ContactRequestCreateRequest(
        @NotNull(message = "Student profile id is required")
        UUID studentProfileId,

        @Size(max = 1000, message = "Message must be less than 1000 characters")
        String message
) {
}

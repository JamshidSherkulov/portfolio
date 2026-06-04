package com.portfolio.backend.contactrequest.dto;

import com.portfolio.backend.contactrequest.entity.ContactRequestStatus;
import jakarta.validation.constraints.NotNull;

public record ContactRequestStatusUpdateRequest(
        @NotNull(message = "Status is required")
        ContactRequestStatus status
) {}

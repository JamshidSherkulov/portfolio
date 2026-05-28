package com.portfolio.backend.user.dto;

import com.portfolio.backend.user.entity.Role;

import java.time.LocalDateTime;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String email,
        Role role,
        LocalDateTime createdAt
) {
}

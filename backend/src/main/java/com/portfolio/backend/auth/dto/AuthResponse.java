package com.portfolio.backend.auth.dto;

import com.portfolio.backend.user.entity.Role;

import java.util.UUID;

public record AuthResponse(
        UUID id,
        String email,
        Role role,
        String token
) {
}

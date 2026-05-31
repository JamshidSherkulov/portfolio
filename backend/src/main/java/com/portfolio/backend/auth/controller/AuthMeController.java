package com.portfolio.backend.auth.controller;

import com.portfolio.backend.user.dto.UserResponse;
import com.portfolio.backend.user.entity.User;
import com.portfolio.backend.user.repository.UserRepository;
import com.portfolio.backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthMeController {

    private final UserRepository userRepository;
    private final UserService userService;

    @GetMapping("/me")
    public UserResponse me(Authentication authentication) {
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return userService.toResponse(user);
    }
}
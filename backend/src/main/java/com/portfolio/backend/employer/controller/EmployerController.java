package com.portfolio.backend.employer.controller;

import com.portfolio.backend.employer.dto.EmployerProfileRequest;
import com.portfolio.backend.employer.dto.EmployerProfileResponse;
import com.portfolio.backend.employer.service.EmployerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/employers")
@RequiredArgsConstructor
public class EmployerController {

    private final EmployerService employerService;

    @PostMapping("/me")
    public EmployerProfileResponse createMyProfile(
            Authentication authentication,
            @Valid @RequestBody EmployerProfileRequest request
    ) {
        return employerService.createMyProfile(
                authentication.getName(),
                request
        );
    }

    @GetMapping("/me")
    public EmployerProfileResponse getMyProfile(
            Authentication authentication
    ) {
        return employerService.getMyProfile(
                authentication.getName()
        );
    }

    @PutMapping("/me")
    public EmployerProfileResponse updateMyProfile(
            Authentication authentication,
            @Valid @RequestBody EmployerProfileRequest request
    ) {
        return employerService.updateMyProfile(
                authentication.getName(),
                request
        );
    }

    @GetMapping("/{id}")
    public EmployerProfileResponse getProfileById(
            @PathVariable UUID id
    ) {
        return employerService.getProfileById(id);
    }
}

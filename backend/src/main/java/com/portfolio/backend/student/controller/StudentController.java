package com.portfolio.backend.student.controller;

import com.portfolio.backend.student.dto.StudentProfileRequest;
import com.portfolio.backend.student.dto.StudentProfileResponse;
import com.portfolio.backend.student.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @PostMapping("/me")
    public StudentProfileResponse createMyProfile(
            Authentication authentication,
            @Valid @RequestBody StudentProfileRequest request
    ) {
        return studentService.createMyProfile(
                authentication.getName(),
                request
        );
    }

    @GetMapping("/me")
    public StudentProfileResponse getMyProfile(
            Authentication authentication
    ) {
        return studentService.getMyProfile(
                authentication.getName()
        );
    }

    @PutMapping("/me")
    public StudentProfileResponse updateMyProfile(
            Authentication authentication,
            @Valid @RequestBody StudentProfileRequest request
    ) {
        return studentService.updateMyProfile(
                authentication.getName(),
                request
        );
    }

    @GetMapping("/{id}")
    public StudentProfileResponse getProfileById(
            @PathVariable UUID id
    ) {
        return studentService.getProfileById(id);
    }
}

package com.portfolio.backend.project.controller;

import com.portfolio.backend.project.dto.ProjectRequest;
import com.portfolio.backend.project.dto.ProjectResponse;
import com.portfolio.backend.project.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping("/me")
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectResponse createMyProject(
            Authentication authentication,
            @Valid @RequestBody ProjectRequest request
    ) {
        return projectService.createMyProject(
                authentication.getName(),
                request
        );
    }

    @GetMapping("/me")
    public List<ProjectResponse> getMyProjects(
            Authentication authentication
    ) {
        return projectService.getMyProjects(
                authentication.getName()
        );
    }

    @GetMapping("/{projectId}")
    public ProjectResponse getProjectById(
            @PathVariable UUID projectId
    ) {
        return projectService.getProjectById(projectId);
    }

    @PutMapping("/{projectId}")
    public ProjectResponse updateMyProject(
            Authentication authentication,
            @PathVariable UUID projectId,
            @Valid @RequestBody ProjectRequest request
    ) {
        return projectService.updateMyProject(
                authentication.getName(),
                projectId,
                request
        );
    }

    @DeleteMapping("/{projectId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMyProject(
            Authentication authentication,
            @PathVariable UUID projectId
    ) {
        projectService.deleteMyProject(
                authentication.getName(),
                projectId
        );
    }

    @GetMapping("/student/{studentProfileId}")
    public List<ProjectResponse> getProjectsByStudentProfileId(
            @PathVariable UUID studentProfileId
    ) {
        return projectService.getProjectsByStudentProfileId(studentProfileId);
    }
}

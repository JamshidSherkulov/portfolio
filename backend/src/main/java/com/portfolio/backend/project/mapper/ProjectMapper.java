package com.portfolio.backend.project.mapper;


import com.portfolio.backend.project.dto.ProjectResponse;
import com.portfolio.backend.project.entity.Project;

import java.util.List;

public class ProjectMapper {

    private ProjectMapper() {
    }

    public static ProjectResponse toResponse(Project project) {
        return new ProjectResponse(
                project.getId(),
                project.getStudentProfile().getId(),
                project.getTitle(),
                project.getDescription(),
                project.getProofSummary(),
                project.getTechStack() == null ? List.of() : project.getTechStack(),
                project.getGithubUrl(),
                project.getLiveDemoUrl(),
                project.getImageUrl(),
                project.getProjectType(),
                project.getStatus(),
                project.getCreatedAt(),
                project.getUpdatedAt()
        );
    }
}

package com.portfolio.backend.project.service;

import com.portfolio.backend.project.dto.ProjectRequest;
import com.portfolio.backend.project.dto.ProjectResponse;
import com.portfolio.backend.project.entity.Project;
import com.portfolio.backend.project.mapper.ProjectMapper;
import com.portfolio.backend.project.repository.ProjectRepository;
import com.portfolio.backend.student.entity.StudentProfile;
import com.portfolio.backend.student.repository.StudentProfileRepository;
import com.portfolio.backend.user.entity.Role;
import com.portfolio.backend.user.entity.User;
import com.portfolio.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;

    public ProjectResponse createMyProject(
            String email,
            ProjectRequest request
    ) {
        User user = getUserByEmail(email);

        if (user.getRole() != Role.STUDENT) {
            throw new RuntimeException("Only students can create projects");
        }

        StudentProfile studentProfile = studentProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Student profile must be created before adding projects"));

        Project project = Project.builder()
                .studentProfile(studentProfile)
                .title(clean(request.title()))
                .description(clean(request.description()))
                .proofSummary(clean(request.proofSummary()))
                .techStack(cleanList(request.techStack()))
                .githubUrl(clean(request.githubUrl()))
                .liveDemoUrl(clean(request.liveDemoUrl()))
                .imageUrl(clean(request.imageUrl()))
                .projectType(clean(request.projectType()))
                .status(clean(request.status()))
                .build();

        Project savedProject = projectRepository.save(project);

        return ProjectMapper.toResponse(savedProject);
    }

    public List<ProjectResponse> getMyProjects(String email) {
        User user = getUserByEmail(email);

        StudentProfile studentProfile = studentProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Student profile not found"));

        return projectRepository.findByStudentProfileOrderByCreatedAtDesc(studentProfile)
                .stream()
                .map(ProjectMapper::toResponse)
                .toList();
    }

    public List<ProjectResponse> getProjectsByStudentProfileId(UUID studentProfileId) {
        StudentProfile studentProfile = studentProfileRepository.findById(studentProfileId)
                .orElseThrow(() -> new RuntimeException("Student profile not found"));

        return projectRepository.findByStudentProfileOrderByCreatedAtDesc(studentProfile)
                .stream()
                .map(ProjectMapper::toResponse)
                .toList();
    }

    public ProjectResponse updateMyProject(
            String email,
            UUID projectId,
            ProjectRequest request
    ) {
        User user = getUserByEmail(email);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (!project.getStudentProfile().getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can only update your own projects");
        }

        project.setTitle(clean(request.title()));
        project.setDescription(clean(request.description()));
        project.setProofSummary(clean(request.proofSummary()));
        project.setTechStack(cleanList(request.techStack()));
        project.setGithubUrl(clean(request.githubUrl()));
        project.setLiveDemoUrl(clean(request.liveDemoUrl()));
        project.setImageUrl(clean(request.imageUrl()));
        project.setProjectType(clean(request.projectType()));
        project.setStatus(clean(request.status()));

        Project updatedProject = projectRepository.save(project);

        return ProjectMapper.toResponse(updatedProject);
    }

    public void deleteMyProject(
            String email,
            UUID projectId
    ) {
        User user = getUserByEmail(email);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (!project.getStudentProfile().getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can only delete your own projects");
        }

        projectRepository.delete(project);
    }

    public ProjectResponse getProjectById(UUID projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        return ProjectMapper.toResponse(project);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private String clean(String value) {
        if (value == null) {
            return null;
        }

        String cleaned = value.trim();

        if (cleaned.isBlank()) {
            return null;
        }

        return cleaned;
    }

    private List<String> cleanList(List<String> values) {
        if (values == null) {
            return new ArrayList<>();
        }

        return values.stream()
                .filter(value -> value != null && !value.trim().isBlank())
                .map(String::trim)
                .distinct()
                .toList();
    }
}
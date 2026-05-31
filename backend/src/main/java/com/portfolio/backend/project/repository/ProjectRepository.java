package com.portfolio.backend.project.repository;

import com.portfolio.backend.project.entity.Project;
import com.portfolio.backend.student.entity.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID> {

    List<Project> findByStudentProfileOrderByCreatedAtDesc(StudentProfile studentProfile);

    long countByStudentProfile(StudentProfile studentProfile);
}
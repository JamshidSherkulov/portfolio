package com.portfolio.backend.project.entity;

import com.portfolio.backend.student.entity.StudentProfile;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_profile_id", nullable = false)
    private StudentProfile studentProfile;

    @Column(nullable = false, length = 140)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(length = 1000)
    private String proofSummary;

    @ElementCollection
    @CollectionTable(
            name = "project_tech_stack",
            joinColumns = @JoinColumn(name = "project_id")
    )
    @Column(name = "technology", length = 80)
    @Builder.Default
    private List<String> techStack = new ArrayList<>();

    @Column(length = 255)
    private String githubUrl;

    @Column(length = 255)
    private String liveDemoUrl;

    @Column(length = 255)
    private String imageUrl;

    @Column(length = 120)
    private String projectType;

    @Column(length = 80)
    private String status;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}

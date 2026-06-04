package com.portfolio.backend.student.entity;

import com.portfolio.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "student_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, length = 80)
    private String firstName;

    @Column(nullable = false, length = 80)
    private String lastName;

    @Column(length = 160)
    private String headline;

    @Column(length = 120)
    private String location;

    @Column(length = 1000)
    private String bio;

    @Column(length = 120)
    private String university;

    @Column(length = 120)
    private String degree;

    @Column(length = 50)
    private String graduationYear;

    @Column(length = 120)
    private String preferredRole;

    @Column(length = 80)
    private String experienceLevel;

    @Column(length = 120)
    private String availability;

    @Column(length = 255)
    private String githubUrl;

    @Column(length = 255)
    private String linkedinUrl;

    @Column(length = 255)
    private String portfolioUrl;

    @Column(length = 255)
    private String profileImageUrl;

    @ElementCollection
    @CollectionTable(
            name = "student_skills",
            joinColumns = @JoinColumn(name = "student_profile_id")
    )
    @Column(name = "skill", length = 80)
    @Builder.Default
    private List<String> skills = new ArrayList<>();
}

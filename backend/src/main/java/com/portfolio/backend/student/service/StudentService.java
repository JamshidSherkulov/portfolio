package com.portfolio.backend.student.service;

import com.portfolio.backend.student.dto.StudentProfileRequest;
import com.portfolio.backend.student.dto.StudentProfileResponse;
import com.portfolio.backend.student.entity.StudentProfile;
import com.portfolio.backend.student.mapper.StudentMapper;
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
public class StudentService {

    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;

    public StudentProfileResponse createMyProfile(
            String email,
            StudentProfileRequest request
    ) {
        User user = getUserByEmail(email);

        if (user.getRole() != Role.STUDENT) {
            throw new RuntimeException("Only students can create student profiles");
        }

        if (studentProfileRepository.existsByUser(user)) {
            throw new RuntimeException("Student profile already exists");
        }

        StudentProfile profile = StudentProfile.builder()
                .user(user)
                .firstName(clean(request.firstName()))
                .lastName(clean(request.lastName()))
                .headline(clean(request.headline()))
                .location(clean(request.location()))
                .bio(clean(request.bio()))
                .university(clean(request.university()))
                .degree(clean(request.degree()))
                .graduationYear(clean(request.graduationYear()))
                .preferredRole(clean(request.preferredRole()))
                .experienceLevel(clean(request.experienceLevel()))
                .availability(clean(request.availability()))
                .githubUrl(clean(request.githubUrl()))
                .linkedinUrl(clean(request.linkedinUrl()))
                .portfolioUrl(clean(request.portfolioUrl()))
                .profileImageUrl(clean(request.profileImageUrl()))
                .skills(cleanSkills(request.skills()))
                .build();

        StudentProfile savedProfile = studentProfileRepository.save(profile);

        return StudentMapper.toResponse(savedProfile);
    }

    public StudentProfileResponse getMyProfile(String email) {
        User user = getUserByEmail(email);

        StudentProfile profile = studentProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Student profile not found"));

        return StudentMapper.toResponse(profile);
    }

    public StudentProfileResponse updateMyProfile(
            String email,
            StudentProfileRequest request
    ) {
        User user = getUserByEmail(email);

        if (user.getRole() != Role.STUDENT) {
            throw new RuntimeException("Only students can update student profiles");
        }

        StudentProfile profile = studentProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Student profile not found"));

        profile.setFirstName(clean(request.firstName()));
        profile.setLastName(clean(request.lastName()));
        profile.setHeadline(clean(request.headline()));
        profile.setLocation(clean(request.location()));
        profile.setBio(clean(request.bio()));
        profile.setUniversity(clean(request.university()));
        profile.setDegree(clean(request.degree()));
        profile.setGraduationYear(clean(request.graduationYear()));
        profile.setPreferredRole(clean(request.preferredRole()));
        profile.setExperienceLevel(clean(request.experienceLevel()));
        profile.setAvailability(clean(request.availability()));
        profile.setGithubUrl(clean(request.githubUrl()));
        profile.setLinkedinUrl(clean(request.linkedinUrl()));
        profile.setPortfolioUrl(clean(request.portfolioUrl()));
        profile.setProfileImageUrl(clean(request.profileImageUrl()));
        profile.setSkills(cleanSkills(request.skills()));

        StudentProfile updatedProfile = studentProfileRepository.save(profile);

        return StudentMapper.toResponse(updatedProfile);
    }

    public StudentProfileResponse getProfileById(UUID id) {
        StudentProfile profile = studentProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student profile not found"));

        return StudentMapper.toResponse(profile);
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

    private List<String> cleanSkills(List<String> skills) {
        if (skills == null) {
            return new ArrayList<>();
        }

        return skills.stream()
                .filter(skill -> skill != null && !skill.trim().isBlank())
                .map(String::trim)
                .distinct()
                .toList();
    }
}
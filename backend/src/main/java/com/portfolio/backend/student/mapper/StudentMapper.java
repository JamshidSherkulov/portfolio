package com.portfolio.backend.student.mapper;

import com.portfolio.backend.student.dto.StudentProfileResponse;
import com.portfolio.backend.student.entity.StudentProfile;
import java.util.List;

public class StudentMapper {

    private StudentMapper() {
    }

    public static StudentProfileResponse toResponse(StudentProfile profile) {
        return new StudentProfileResponse(
                profile.getId(),
                profile.getUser().getId(),
                profile.getFirstName(),
                profile.getLastName(),
                profile.getHeadline(),
                profile.getLocation(),
                profile.getBio(),
                profile.getUniversity(),
                profile.getDegree(),
                profile.getGraduationYear(),
                profile.getPreferredRole(),
                profile.getExperienceLevel(),
                profile.getAvailability(),
                profile.getGithubUrl(),
                profile.getLinkedinUrl(),
                profile.getPortfolioUrl(),
                profile.getProfileImageUrl(),
                profile.getSkills() == null ? List.of() : profile.getSkills()
        );
    }
}

package com.portfolio.backend.employer.mapper;

import com.portfolio.backend.employer.dto.EmployerProfileResponse;
import com.portfolio.backend.employer.entity.EmployerProfile;

public class EmployerMapper {

    private EmployerMapper() {
    }

    public static EmployerProfileResponse toResponse(EmployerProfile profile) {
        return new EmployerProfileResponse(
                profile.getId(),
                profile.getUser().getId(),
                profile.getCompanyName(),
                profile.getWebsite(),
                profile.getIndustry(),
                profile.getLocation(),
                profile.getCompanySize(),
                profile.getDescription(),
                profile.getLogoUrl()
        );
    }
}
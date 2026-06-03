package com.portfolio.backend.employer.service;

import com.portfolio.backend.common.exception.ResourceNotFoundException;
import com.portfolio.backend.employer.dto.EmployerProfileRequest;
import com.portfolio.backend.employer.dto.EmployerProfileResponse;
import com.portfolio.backend.employer.entity.EmployerProfile;
import com.portfolio.backend.employer.mapper.EmployerMapper;
import com.portfolio.backend.employer.repository.EmployerProfileRepository;
import com.portfolio.backend.user.entity.Role;
import com.portfolio.backend.user.entity.User;
import com.portfolio.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EmployerService {

    private final EmployerProfileRepository employerProfileRepository;
    private final UserRepository userRepository;

    public EmployerProfileResponse createMyProfile(
            String email,
            EmployerProfileRequest request
    ) {
        User user = getUserByEmail(email);

        if (user.getRole() != Role.EMPLOYER) {
            throw new RuntimeException("Only employers can create employer profiles");
        }

        if (employerProfileRepository.existsByUser(user)) {
            throw new RuntimeException("Employer profile already exists");
        }

        EmployerProfile profile = EmployerProfile.builder()
                .user(user)
                .companyName(clean(request.companyName()))
                .website(clean(request.website()))
                .industry(clean(request.industry()))
                .location(clean(request.location()))
                .companySize(clean(request.companySize()))
                .description(clean(request.description()))
                .logoUrl(clean(request.logoUrl()))
                .build();

        EmployerProfile savedProfile = employerProfileRepository.save(profile);

        return EmployerMapper.toResponse(savedProfile);
    }

    public EmployerProfileResponse getMyProfile(String email) {
        User user = getUserByEmail(email);

        EmployerProfile profile = employerProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Employer profile not found"));

        return EmployerMapper.toResponse(profile);
    }

    public EmployerProfileResponse updateMyProfile(
            String email,
            EmployerProfileRequest request
    ) {
        User user = getUserByEmail(email);

        if (user.getRole() != Role.EMPLOYER) {
            throw new RuntimeException("Only employers can update employer profiles");
        }

        EmployerProfile profile = employerProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Employer profile not found"));

        profile.setCompanyName(clean(request.companyName()));
        profile.setWebsite(clean(request.website()));
        profile.setIndustry(clean(request.industry()));
        profile.setLocation(clean(request.location()));
        profile.setCompanySize(clean(request.companySize()));
        profile.setDescription(clean(request.description()));
        profile.setLogoUrl(clean(request.logoUrl()));

        EmployerProfile updatedProfile = employerProfileRepository.save(profile);

        return EmployerMapper.toResponse(updatedProfile);
    }

    public EmployerProfileResponse getProfileById(UUID id) {
        EmployerProfile profile = employerProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employer profile not found"));

        return EmployerMapper.toResponse(profile);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("Employer profile not found"));
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
}

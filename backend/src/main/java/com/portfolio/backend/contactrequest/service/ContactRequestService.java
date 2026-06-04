package com.portfolio.backend.contactrequest.service;

import com.portfolio.backend.common.exception.ResourceNotFoundException;
import com.portfolio.backend.contactrequest.dto.ContactRequestCreateRequest;
import com.portfolio.backend.contactrequest.dto.ContactRequestResponse;
import com.portfolio.backend.contactrequest.dto.ContactRequestStatusUpdateRequest;
import com.portfolio.backend.contactrequest.entity.ContactRequest;
import com.portfolio.backend.contactrequest.entity.ContactRequestStatus;
import com.portfolio.backend.contactrequest.repository.ContactRequestRepository;
import com.portfolio.backend.employer.entity.EmployerProfile;
import com.portfolio.backend.employer.repository.EmployerProfileRepository;
import com.portfolio.backend.student.entity.StudentProfile;
import com.portfolio.backend.student.repository.StudentProfileRepository;
import com.portfolio.backend.user.entity.Role;
import com.portfolio.backend.user.entity.User;
import com.portfolio.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ContactRequestService {

    private final ContactRequestRepository contactRequestRepository;
    private final EmployerProfileRepository employerProfileRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;

    public ContactRequestResponse createContactRequest(
            String employerEmail,
            ContactRequestCreateRequest request
    ) {
        User employerUser = getUserByEmail(employerEmail);

        if (employerUser.getRole() != Role.EMPLOYER) {
            throw new RuntimeException("Only employers can send contact requests");
        }

        EmployerProfile employerProfile = employerProfileRepository.findByUser(employerUser)
                .orElseThrow(() -> new ResourceNotFoundException("Employer profile not found"));

        StudentProfile studentProfile = studentProfileRepository.findById(request.studentProfileId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        if (contactRequestRepository.existsByEmployerProfileAndStudentProfile(
                employerProfile,
                studentProfile
        )) {
            ContactRequest existingRequest = contactRequestRepository
                    .findByEmployerProfileAndStudentProfile(employerProfile, studentProfile)
                    .orElseThrow();

            return toResponse(existingRequest);
        }

        ContactRequest contactRequest = ContactRequest.builder()
                .employerProfile(employerProfile)
                .studentProfile(studentProfile)
                .message(clean(request.message()))
                .status(ContactRequestStatus.PENDING)
                .build();

        ContactRequest savedRequest = contactRequestRepository.save(contactRequest);

        return toResponse(savedRequest);
    }

    public List<ContactRequestResponse> getEmployerContactRequests(
            String employerEmail
    ) {
        User employerUser = getUserByEmail(employerEmail);

        if (employerUser.getRole() != Role.EMPLOYER) {
            throw new RuntimeException("Only employers can view employer contact requests");
        }

        EmployerProfile employerProfile = employerProfileRepository.findByUser(employerUser)
                .orElseThrow(() -> new ResourceNotFoundException("Employer profile not found"));

        return contactRequestRepository
                .findByEmployerProfileOrderByRequestedAtDesc(employerProfile)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<ContactRequestResponse> getStudentContactRequests(
            String studentEmail
    ) {
        User studentUser = getUserByEmail(studentEmail);

        if (studentUser.getRole() != Role.STUDENT) {
            throw new RuntimeException("Only students can view student contact requests");
        }

        StudentProfile studentProfile = studentProfileRepository.findByUser(studentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        return contactRequestRepository
                .findByStudentProfileOrderByRequestedAtDesc(studentProfile)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ContactRequestResponse updateContactRequestStatus(
            String studentEmail,
            UUID contactRequestId,
            ContactRequestStatusUpdateRequest request
    ) {
        User studentUser = getUserByEmail(studentEmail);

        if (studentUser.getRole() != Role.STUDENT) {
            throw new RuntimeException("Only students can update contact request status");
        }

        StudentProfile studentProfile = studentProfileRepository.findByUser(studentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        ContactRequest contactRequest = contactRequestRepository.findById(contactRequestId)
                .orElseThrow(() -> new ResourceNotFoundException("Contact request not found"));

        if (!contactRequest.getStudentProfile().getId().equals(studentProfile.getId())) {
            throw new RuntimeException("You can only update requests sent to your profile");
        }

        if (request.status() == ContactRequestStatus.PENDING) {
            throw new RuntimeException("Status can only be updated to ACCEPTED or REJECTED");
        }

        contactRequest.setStatus(request.status());

        ContactRequest updatedRequest = contactRequestRepository.save(contactRequest);

        return toResponse(updatedRequest);
    }

    private ContactRequestResponse toResponse(ContactRequest contactRequest) {
        EmployerProfile employer = contactRequest.getEmployerProfile();
        StudentProfile student = contactRequest.getStudentProfile();

        return new ContactRequestResponse(
                contactRequest.getId(),

                employer.getId(),
                employer.getCompanyName(),
                employer.getWebsite(),
                employer.getIndustry(),
                employer.getLocation(),

                student.getId(),
                student.getFirstName(),
                student.getLastName(),
                student.getHeadline(),
                student.getLocation(),
                student.getPreferredRole(),
                student.getSkills(),

                contactRequest.getMessage(),
                contactRequest.getStatus(),
                contactRequest.getRequestedAt(),
                contactRequest.getUpdatedAt()
        );
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
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
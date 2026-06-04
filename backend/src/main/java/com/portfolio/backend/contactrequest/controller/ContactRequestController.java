package com.portfolio.backend.contactrequest.controller;

import com.portfolio.backend.contactrequest.dto.ContactRequestCreateRequest;
import com.portfolio.backend.contactrequest.dto.ContactRequestResponse;
import com.portfolio.backend.contactrequest.dto.ContactRequestStatusUpdateRequest;
import com.portfolio.backend.contactrequest.service.ContactRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/contact-requests")
@RequiredArgsConstructor
public class ContactRequestController {

    private final ContactRequestService contactRequestService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ContactRequestResponse createContactRequest(
            Authentication authentication,
            @Valid @RequestBody ContactRequestCreateRequest request
    ) {
        return contactRequestService.createContactRequest(
                authentication.getName(),
                request
        );
    }

    @GetMapping("/employer")
    public List<ContactRequestResponse> getEmployerContactRequests(
            Authentication authentication
    ) {
        return contactRequestService.getEmployerContactRequests(
                authentication.getName()
        );
    }

    @GetMapping("/student")
    public List<ContactRequestResponse> getStudentContactRequests(
            Authentication authentication
    ) {
        return contactRequestService.getStudentContactRequests(
                authentication.getName()
        );
    }

    @PutMapping("/{contactRequestId}/status")
    public ContactRequestResponse updateContactRequestStatus(
            Authentication authentication,
            @PathVariable UUID contactRequestId,
            @Valid @RequestBody ContactRequestStatusUpdateRequest request
    ) {
        return contactRequestService.updateContactRequestStatus(
                authentication.getName(),
                contactRequestId,
                request
        );
    }
}
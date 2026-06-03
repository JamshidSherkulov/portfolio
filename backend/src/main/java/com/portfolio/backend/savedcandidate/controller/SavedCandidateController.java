package com.portfolio.backend.savedcandidate.controller;

import com.portfolio.backend.savedcandidate.dto.SavedCandidateResponse;
import com.portfolio.backend.savedcandidate.service.SavedCandidateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/saved-candidates")
@RequiredArgsConstructor
public class SavedCandidateController {

    private final SavedCandidateService savedCandidateService;

    @PostMapping("/{studentProfileId}")
    @ResponseStatus(HttpStatus.CREATED)
    public SavedCandidateResponse saveCandidate(
            Authentication authentication,
            @PathVariable UUID studentProfileId
    ) {
        return savedCandidateService.saveCandidate(
                authentication.getName(),
                studentProfileId
        );
    }

    @GetMapping
    public List<SavedCandidateResponse> getSavedCandidates(
            Authentication authentication
    ) {
        return savedCandidateService.getSavedCandidates(
                authentication.getName()
        );
    }

    @DeleteMapping("/{studentProfileId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeSavedCandidate(
            Authentication authentication,
            @PathVariable UUID studentProfileId
    ) {
        savedCandidateService.removeSavedCandidate(
                authentication.getName(),
                studentProfileId
        );
    }
}

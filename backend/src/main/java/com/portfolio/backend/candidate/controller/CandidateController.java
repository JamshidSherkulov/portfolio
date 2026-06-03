package com.portfolio.backend.candidate.controller;

import com.portfolio.backend.candidate.dto.CandidateDetailResponse;
import com.portfolio.backend.candidate.dto.CandidateSummaryResponse;
import com.portfolio.backend.candidate.service.CandidateService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/candidates")
@RequiredArgsConstructor
public class CandidateController {

    private final CandidateService candidateService;

    @GetMapping
    public List<CandidateSummaryResponse> searchCandidates(
            Authentication authentication,
            @RequestParam(required = false) String skill,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String preferredRole,
            @RequestParam(required = false) String experienceLevel
    ) {
        return candidateService.searchCandidates(
                authentication.getName(),
                skill,
                location,
                preferredRole,
                experienceLevel
        );
    }

    @GetMapping("/{studentProfileId}")
    public CandidateDetailResponse getCandidateById(
            Authentication authentication,
            @PathVariable UUID studentProfileId
    ) {
        return candidateService.getCandidateById(
                authentication.getName(),
                studentProfileId
        );
    }
}
package com.portfolio.backend.savedcandidate.entity;

import com.portfolio.backend.employer.entity.EmployerProfile;
import com.portfolio.backend.student.entity.StudentProfile;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(
        name = "saved_candidates",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_employer_saved_candidate",
                        columnNames = {"employer_profile_id", "student_profile_id"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SavedCandidate {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employer_profile_id", nullable = false)
    private EmployerProfile employerProfile;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_profile_id", nullable = false)
    private StudentProfile studentProfile;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime savedAt;
}
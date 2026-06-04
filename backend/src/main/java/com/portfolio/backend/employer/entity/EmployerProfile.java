package com.portfolio.backend.employer.entity;

import com.portfolio.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "employer_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, length = 120)
    private String companyName;

    @Column(length = 255)
    private String website;

    @Column(length = 120)
    private String industry;

    @Column(length = 120)
    private String location;

    @Column(length = 80)
    private String companySize;

    @Column(length = 1000)
    private String description;

    @Column(length = 255)
    private String logoUrl;
}
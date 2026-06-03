package com.portfolio.backend.candidate.repository;

import com.portfolio.backend.student.entity.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface CandidateRepository extends JpaRepository<StudentProfile, UUID> {

    @Query("""
            SELECT DISTINCT sp
            FROM StudentProfile sp
            LEFT JOIN sp.skills skill
            WHERE
                (:skill = '' OR LOWER(skill) LIKE LOWER(CONCAT('%', :skill, '%')))
            AND
                (:location = '' OR LOWER(sp.location) LIKE LOWER(CONCAT('%', :location, '%')))
            AND
                (:preferredRole = '' OR LOWER(sp.preferredRole) LIKE LOWER(CONCAT('%', :preferredRole, '%')))
            AND
                (:experienceLevel = '' OR LOWER(sp.experienceLevel) LIKE LOWER(CONCAT('%', :experienceLevel, '%')))
            ORDER BY sp.firstName ASC, sp.lastName ASC
            """)
    List<StudentProfile> searchCandidates(
            @Param("skill") String skill,
            @Param("location") String location,
            @Param("preferredRole") String preferredRole,
            @Param("experienceLevel") String experienceLevel
    );
}
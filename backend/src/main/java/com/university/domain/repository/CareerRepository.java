package com.university.domain.repository;

import com.university.domain.model.Career;
import com.university.domain.model.enums.CareerStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CareerRepository extends JpaRepository<Career, Long> {
    Optional<Career> findByCareerCode(String careerCode);
    List<Career> findByStatus(CareerStatus status);
    boolean existsByCareerCode(String careerCode);
}

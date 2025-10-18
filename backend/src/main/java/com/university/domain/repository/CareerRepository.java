package com.university.domain.repository;

import com.university.domain.model.Career;
import com.university.domain.model.enums.CareerStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CareerRepository extends JpaRepository<Career, Long> {
    Optional<Career> findByCareerCode(String careerCode);
    List<Career> findByStatus(CareerStatus status);
    boolean existsByCareerCode(String careerCode);
    List<Career> findByCareerNameContainingIgnoreCase(String careerName);
    @Query("SELECT c FROM Career c WHERE c.department.id = :departmentId AND c.status = 'ACTIVE'")
    List<Career> findActiveByDepartment(@Param("departmentId") Long departmentId);
    List<Career> findByDepartmentId(Long departmentId);
}

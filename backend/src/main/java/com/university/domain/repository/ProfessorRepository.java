package com.university.domain.repository;

import com.university.domain.model.Professor;
import com.university.domain.model.enums.EmploymentType;
import com.university.domain.model.enums.ProfessorStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProfessorRepository extends JpaRepository<Professor, Long> {
    Optional<Professor> findByEmployeeCode(String employeeCode);
    Optional<Professor> findByUserId(Long userId);

    @Query("SELECT p FROM Professor p WHERE p.user.email = :email")
    Optional<Professor> findByUserEmail(@Param("email") String email);

    boolean existsByEmployeeCode(String employeeCode);
    boolean existsByUserId(Long userId);

    List<Professor> findByDepartmentId(Long departmentId);
    List<Professor> findByStatus(ProfessorStatus status);
    List<Professor> findByEmploymentType(EmploymentType employmentType);
    List<Professor> findBySpecializationContainingIgnoreCase(String specialization);
}

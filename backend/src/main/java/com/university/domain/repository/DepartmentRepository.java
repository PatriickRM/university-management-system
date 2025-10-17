package com.university.domain.repository;

import com.university.domain.model.Department;
import com.university.domain.model.enums.DepartmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
    Optional<Department> findByDepartmentCode(String departmentCode);
    List<Department> findByStatus(DepartmentStatus status);
    boolean existsByDepartmentCode(String departmentCode);
    List<Department> findByDepartmentNameContainingIgnoreCase(String departmentName);
}

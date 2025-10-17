package com.university.application.service;

import com.university.domain.model.enums.DepartmentStatus;
import com.university.web.dto.department.DepartmentCreateRequestDTO;
import com.university.web.dto.department.DepartmentResponseDTO;
import com.university.web.dto.department.DepartmentUpdateRequestDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface DepartmentService {
    //CRUD
    DepartmentResponseDTO createDepartment(DepartmentCreateRequestDTO dto);
    DepartmentResponseDTO getDepartmentById(Long id);
    DepartmentResponseDTO updateDepartment(Long id, DepartmentUpdateRequestDTO dto);
    void deleteDepartment(Long id);

    List<DepartmentResponseDTO> getAllDepartments();
    Page<DepartmentResponseDTO> getAllDepartmentsPageable(Pageable pageable);
    DepartmentResponseDTO getDepartmentByCode(String departmentCode);
    List<DepartmentResponseDTO> getDepartmentsByStatus(DepartmentStatus status);
    List<DepartmentResponseDTO> searchDepartmentsByName(String name);
}

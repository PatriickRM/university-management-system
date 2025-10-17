package com.university.application.mapper;

import com.university.domain.model.Department;
import com.university.web.dto.department.DepartmentCreateRequestDTO;
import com.university.web.dto.department.DepartmentResponseDTO;
import com.university.web.dto.department.DepartmentUpdateRequestDTO;

public interface DepartmentMapper {
    Department toEntity(DepartmentCreateRequestDTO dto);
    DepartmentResponseDTO toResponseDto(Department department);
    void updateEntity(DepartmentUpdateRequestDTO dto, Department department);
}

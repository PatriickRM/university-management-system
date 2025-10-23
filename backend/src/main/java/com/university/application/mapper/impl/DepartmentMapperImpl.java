package com.university.application.mapper.impl;

import com.university.application.mapper.DepartmentMapper;
import com.university.domain.model.Department;
import com.university.domain.model.enums.DepartmentStatus;
import com.university.web.dto.department.DepartmentCreateRequestDTO;
import com.university.web.dto.department.DepartmentResponseDTO;
import com.university.web.dto.department.DepartmentUpdateRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
public class DepartmentMapperImpl implements DepartmentMapper {

    @Override
    public Department toEntity(DepartmentCreateRequestDTO dto) {
        return Department.builder()
                .departmentName(dto.getDepartmentName())
                .departmentCode(dto.getDepartmentCode())
                .phone(dto.getPhone())
                .location(dto.getLocation())
                .description(dto.getDescription())
                .status(DepartmentStatus.ACTIVO)
                .build();
    }

    @Override
    public DepartmentResponseDTO toResponseDto(Department department) {
        return DepartmentResponseDTO.builder()
                .id(department.getId())
                .departmentName(department.getDepartmentName())
                .departmentCode(department.getDepartmentCode())
                .location(department.getLocation())
                .description(department.getDescription())
                .phone(department.getPhone())
                .status(department.getStatus())
                .build();
    }

    @Override
    public void updateEntity(DepartmentUpdateRequestDTO dto, Department department) {
        if(dto.getDepartmentName() != null) department.setDepartmentName(dto.getDepartmentName());
        if (dto.getDescription() != null) department.setDescription(dto.getDescription());
        if (dto.getLocation() != null) department.setLocation(dto.getLocation());
        if (dto.getPhone() != null) department.setPhone(dto.getPhone());
        if (dto.getStatus() != null) department.setStatus(dto.getStatus());
    }
}

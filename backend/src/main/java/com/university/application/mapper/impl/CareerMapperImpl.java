package com.university.application.mapper.impl;

import com.university.application.mapper.CareerMapper;
import com.university.domain.model.Career;
import com.university.domain.model.Department;
import com.university.domain.model.enums.CareerStatus;
import com.university.web.dto.career.CareerCreateRequestDTO;
import com.university.web.dto.career.CareerResponseDTO;
import com.university.web.dto.career.CareerUpdateRequestDTO;
import com.university.web.dto.department.DepartmentBasicDTO;
import org.springframework.stereotype.Component;

@Component
public class CareerMapperImpl implements CareerMapper {

    @Override
    public Career toEntity(CareerCreateRequestDTO dto) {
        return Career.builder()
                .careerCode(dto.getCareerCode())
                .careerName(dto.getCareerName())
                .description(dto.getDescription())
                .durationSemesters(dto.getDurationSemesters())
                .status(CareerStatus.ACTIVO)
                .build();
    }

    @Override
    public void updateEntity(Career career, CareerUpdateRequestDTO dto) {
        if (dto.getCareerName() != null) career.setCareerName(dto.getCareerName());
        if (dto.getDescription() != null) career.setDescription(dto.getDescription());
        if (dto.getDurationSemesters() != null) career.setDurationSemesters(dto.getDurationSemesters());
        if (dto.getStatus() != null) career.setStatus(dto.getStatus());
    }

    @Override
    public CareerResponseDTO toResponseDTO(Career career) {
        return CareerResponseDTO.builder()
                .id(career.getId())
                .careerCode(career.getCareerCode())
                .careerName(career.getCareerName())
                .description(career.getDescription())
                .durationSemesters(career.getDurationSemesters())
                .status(career.getStatus())
                .department(toDepartmentBasicDTO(career.getDepartment()))
                .build();
    }

    private DepartmentBasicDTO toDepartmentBasicDTO(Department department) {
        return DepartmentBasicDTO.builder()
                .id(department.getId())
                .departmentCode(department.getDepartmentCode())
                .departmentName(department.getDepartmentName())
                .location(department.getLocation())
                .build();
    }
}

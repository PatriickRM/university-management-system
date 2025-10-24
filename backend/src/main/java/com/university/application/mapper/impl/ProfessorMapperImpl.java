package com.university.application.mapper.impl;

import com.university.application.mapper.ProfessorMapper;
import com.university.application.mapper.UserMapper;
import com.university.domain.model.Department;
import com.university.domain.model.Professor;
import com.university.domain.model.enums.ProfessorStatus;
import com.university.web.dto.department.DepartmentBasicDTO;
import com.university.web.dto.professor.ProfessorCreateRequestDTO;
import com.university.web.dto.professor.ProfessorResponseDTO;
import com.university.web.dto.professor.ProfessorUpdateRequestDTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class ProfessorMapperImpl implements ProfessorMapper {
    private final UserMapper userMapper;

    @Override
    public Professor toEntity(ProfessorCreateRequestDTO dto) {
        return Professor.builder()
                .employeeCode(dto.getEmployeeCode())
                .employmentType(dto.getEmploymentType())
                .hireDate(dto.getHireDate())
                .officeLocation(dto.getOfficeLocation())
                .specialization(dto.getSpecialization())
                .status(ProfessorStatus.ACTIVO)
                .build();
    }

    @Override
    public void updateEntity(Professor professor, ProfessorUpdateRequestDTO dto) {
        if(dto.getEmploymentType() != null) professor.setEmploymentType(dto.getEmploymentType());
        if(dto.getOfficeLocation() != null) professor.setOfficeLocation(dto.getOfficeLocation());
        if(dto.getSpecialization() != null) professor.setSpecialization(dto.getSpecialization());
        if(dto.getStatus() != null) professor.setStatus(dto.getStatus());
    }

    @Override
    public ProfessorResponseDTO toResponseDTO(Professor professor) {
        return ProfessorResponseDTO.builder()
                .id(professor.getId())
                .employeeCode(professor.getEmployeeCode())
                .employmentType(professor.getEmploymentType())
                .hireDate(professor.getHireDate())
                .officeLocation(professor.getOfficeLocation())
                .specialization(professor.getSpecialization())
                .status(professor.getStatus())
                .user(userMapper.toResponseDTO(professor.getUser()))
                .department(toDepartmentBasicDTO(professor.getDepartment()))
                .build();
    }

    private DepartmentBasicDTO toDepartmentBasicDTO(Department department){
        return DepartmentBasicDTO.builder()
                .id(department.getId())
                .departmentCode(department.getDepartmentCode())
                .departmentName(department.getDepartmentName())
                .location(department.getLocation())
                .build();
    }
}

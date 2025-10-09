package com.university.web.dto.professor;

import com.university.domain.model.enums.EmploymentType;
import com.university.domain.model.enums.ProfessorStatus;
import com.university.web.dto.department.DepartmentBasicDTO;
import com.university.web.dto.user.UserResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfessorResponseDTO {
    private Long id;
    private String employeeCode;
    private EmploymentType employmentType;
    private LocalDate hireDate;
    private String officeLocation;
    private String specialization;
    private ProfessorStatus status;
    private UserResponseDTO user;
    private DepartmentBasicDTO department;
}

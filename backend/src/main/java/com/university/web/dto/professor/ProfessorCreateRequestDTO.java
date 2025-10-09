package com.university.web.dto.professor;

import com.university.domain.model.enums.EmploymentType;
import com.university.web.dto.user.UserCreateRequestDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfessorCreateRequestDTO {

    @Valid
    @NotNull(message = "User information is required")
    private UserCreateRequestDTO userInfo;

    @NotBlank(message = "Employee code is required")
    private String employeeCode;

    @NotNull(message = "Department ID is required")
    private Long departmentId;

    @NotNull(message = "Employment type is required")
    private EmploymentType employmentType;

    @NotNull(message = "Hire date is required")
    private LocalDate hireDate;

    private String officeLocation;

    private String specialization;
}
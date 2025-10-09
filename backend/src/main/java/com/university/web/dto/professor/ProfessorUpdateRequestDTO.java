package com.university.web.dto.professor;

import com.university.domain.model.enums.EmploymentType;
import com.university.domain.model.enums.ProfessorStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfessorUpdateRequestDTO {
    private Long departmentId;
    private EmploymentType employmentType;
    private String officeLocation;
    private String specialization;
    private ProfessorStatus status;
}

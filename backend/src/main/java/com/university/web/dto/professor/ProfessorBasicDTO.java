package com.university.web.dto.professor;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfessorBasicDTO {
    private Long id;
    private String employeeCode;
    private String fullName;
    private String specialization;
}

package com.university.web.dto.student;

import com.university.domain.model.enums.StudentStatus;
import com.university.web.dto.career.CareerBasicDTO;
import com.university.web.dto.user.UserResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentResponseDTO {
    private Long id;
    private String studentCode;
    private Integer currentSemester;
    private LocalDate admissionDate;
    private Integer totalCredits;
    private BigDecimal totalDebt;
    private String emergencyContactPhone;
    private StudentStatus academicStatus;
    // Datos del usuario
    private UserResponseDTO user;
    // Datos de la carrera
    private CareerBasicDTO career;

}

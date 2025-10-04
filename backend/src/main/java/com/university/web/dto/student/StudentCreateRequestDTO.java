package com.university.web.dto.student;

import com.university.web.dto.user.UserCreateRequestDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class StudentCreateRequestDTO {
    //Datos de USER
    @Valid
    @NotNull(message = "User information is required")
    private UserCreateRequestDTO userInfo;

    @NotBlank(message = "Student code is required")
    private String studentCode;

    @NotNull(message = "Career ID is required")
    private Long careerId;

    private Integer currentSemester;

    @NotNull(message = "Admission date is required")
    private LocalDate admissionDate;

    private Integer totalCredits;

    private BigDecimal totalDebt;

    private String emergencyContactPhone;
}

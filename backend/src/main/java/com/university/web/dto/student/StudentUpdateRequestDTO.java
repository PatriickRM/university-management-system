package com.university.web.dto.student;

import com.university.domain.model.enums.StudentStatus;
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
public class StudentUpdateRequestDTO {
    private Long careerId;
    private Integer currentSemester;
    private Integer totalCredits;
    private BigDecimal totalDebt;
    private String emergencyContactPhone;
    private StudentStatus academicStatus;
}

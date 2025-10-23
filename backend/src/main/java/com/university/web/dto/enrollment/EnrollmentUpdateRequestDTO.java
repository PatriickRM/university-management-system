package com.university.web.dto.enrollment;

import com.university.domain.model.enums.EnrollmentStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentUpdateRequestDTO {
    private EnrollmentStatus status;
    @Min(value = 0, message = "Grade must be at least 0")
    @Max(value = 20, message = "Grade must be at most 20")
    private Double finalGrade;
}
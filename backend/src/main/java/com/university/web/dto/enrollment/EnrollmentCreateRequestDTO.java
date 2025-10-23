package com.university.web.dto.enrollment;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentCreateRequestDTO {
    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Course offering ID is required")
    private Long courseOfferingId;
}
package com.university.web.dto.courseoffering;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseOfferingCreateRequestDTO {
    @NotNull(message = "Course ID is required")
    private Long courseId;

    @NotNull(message = "Academic period ID is required")
    private Long academicPeriodId;

    @NotNull(message = "Professor ID is required")
    private Long professorId;

    @NotNull(message = "Max students is required")
    @Min(value = 1, message = "Max students must be at least 1")
    private Integer maxStudents;
}

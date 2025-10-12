package com.university.web.dto.course;

import com.university.domain.model.enums.CourseStatus;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseUpdateRequestDTO {
    private String courseName;
    private String description;
    @Min(value = 1, message = "Credits must be at least 1")
    private Integer credits;
    private Long departmentId;
    private CourseStatus status;
}
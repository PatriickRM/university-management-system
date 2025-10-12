package com.university.web.dto.course;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseCreateRequestDTO {
    @NotBlank(message = "Course code is required")
    private String courseCode;

    @NotBlank(message = "Course name is required")
    private String courseName;
    private String description;

    @NotNull(message = "Credits is required")
    @Min(value = 1, message = "Credits must be at least 1")
    private Integer credits;

    @NotNull(message = "Department ID is required")
    private Long departmentId;
}

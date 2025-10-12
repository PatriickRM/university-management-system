package com.university.web.dto.course;

import com.university.domain.model.enums.CourseStatus;
import com.university.web.dto.department.DepartmentBasicDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseResponseDTO {
    private Long id;
    private String courseCode;
    private String courseName;
    private String description;
    private Integer credits;
    private CourseStatus status;
    private DepartmentBasicDTO department;
}
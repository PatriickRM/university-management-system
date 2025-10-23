package com.university.web.dto.courseoffering;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseOfferingBasicDTO {
    private Long id;
    private String courseCode;
    private String courseName;
    private String periodCode;
    private String professorName;
    private Integer availableSeats;
}
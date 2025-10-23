package com.university.web.dto.enrollment;

import com.university.domain.model.enums.EnrollmentStatus;
import com.university.web.dto.courseoffering.CourseOfferingBasicDTO;
import com.university.web.dto.student.StudentBasicDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentResponseDTO {
    private Long id;
    private LocalDate enrollmentDate;
    private EnrollmentStatus status;
    private Double finalGrade;
    private StudentBasicDTO student;
    private CourseOfferingBasicDTO courseOffering;
}
package com.university.web.dto.courseoffering;

import com.university.domain.model.enums.OfferingStatus;
import com.university.web.dto.academicperiod.AcademicPeriodResponseDTO;
import com.university.web.dto.course.CourseResponseDTO;
import com.university.web.dto.professor.ProfessorBasicDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseOfferingResponseDTO {
    private Long id;
    private Integer maxStudents;
    private Integer currentEnrollment;
    private Integer availableSeats;  //maxStudents - currentEnrollment
    private OfferingStatus status;
    private CourseResponseDTO course;
    private AcademicPeriodResponseDTO academicPeriod;
    private ProfessorBasicDTO professor;
}

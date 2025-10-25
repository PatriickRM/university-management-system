package com.university.web.dto.courseoffering;

import com.university.domain.model.enums.OfferingStatus;
import com.university.web.dto.academicperiod.AcademicPeriodResponseDTO;
import com.university.web.dto.course.CourseResponseDTO;
import com.university.web.dto.professor.ProfessorBasicDTO;
import com.university.web.dto.timeslot.TimeSlotResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseOfferingResponseDTO {
    private Long id;
    private Integer maxStudents;
    private Integer currentEnrollment;
    private Integer availableSeats;
    private OfferingStatus status;
    private Integer durationWeeks;
    private Double totalWeeklyHours;
    private CourseResponseDTO course;
    private AcademicPeriodResponseDTO academicPeriod;
    private ProfessorBasicDTO professor;

    @Builder.Default
    private List<TimeSlotResponseDTO> timeSlots = new ArrayList<>();
}

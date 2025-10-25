package com.university.application.mapper.impl;

import com.university.application.mapper.AcademicPeriodMapper;
import com.university.application.mapper.CourseMapper;
import com.university.application.mapper.CourseOfferingMapper;
import com.university.application.mapper.TimeSlotMapper;
import com.university.domain.model.CourseOffering;
import com.university.domain.model.Professor;
import com.university.domain.model.enums.OfferingStatus;
import com.university.web.dto.courseoffering.CourseOfferingCreateRequestDTO;
import com.university.web.dto.courseoffering.CourseOfferingResponseDTO;
import com.university.web.dto.courseoffering.CourseOfferingUpdateRequestDTO;
import com.university.web.dto.professor.ProfessorBasicDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class CourseOfferingMapperImpl implements CourseOfferingMapper {
    private final CourseMapper courseMapper;
    private final AcademicPeriodMapper academicPeriodMapper;
    private final TimeSlotMapper timeSlotMapper;

    @Override
    public CourseOffering toEntity(CourseOfferingCreateRequestDTO dto) {
        if (dto == null) return null;

        return CourseOffering.builder()
                .maxStudents(dto.getMaxStudents())
                .currentEnrollment(0)
                .status(OfferingStatus.ABIERTO)
                .durationWeeks(dto.getDurationWeeks() != null ? dto.getDurationWeeks() : 15)
                .build();
    }

    @Override
    public void updateEntity(CourseOffering courseOffering, CourseOfferingUpdateRequestDTO dto) {
        if (courseOffering == null || dto == null) return;

        if (dto.getMaxStudents() != null) courseOffering.setMaxStudents(dto.getMaxStudents());
        if (dto.getStatus() != null) courseOffering.setStatus(dto.getStatus());
    }

    @Override
    public CourseOfferingResponseDTO toResponseDTO(CourseOffering courseOffering) {
        if (courseOffering == null) return null;

        Integer availableSeats = courseOffering.getMaxStudents() -
                (courseOffering.getCurrentEnrollment() != null ? courseOffering.getCurrentEnrollment() : 0);

        return CourseOfferingResponseDTO.builder()
                .id(courseOffering.getId())
                .maxStudents(courseOffering.getMaxStudents())
                .currentEnrollment(courseOffering.getCurrentEnrollment())
                .availableSeats(availableSeats)
                .status(courseOffering.getStatus())
                .durationWeeks(courseOffering.getDurationWeeks())
                .totalWeeklyHours(courseOffering.getTotalWeeklyHours())
                .course(courseMapper.toResponseDto(courseOffering.getCourse()))
                .academicPeriod(academicPeriodMapper.toResponseDTO(courseOffering.getAcademicPeriod()))
                .professor(toProfessorBasicDTO(courseOffering.getProfessor()))
                .timeSlots(courseOffering.getTimeSlots().stream()
                        .map(timeSlotMapper::toResponseDTO).collect(Collectors.toList()))
                .build();
    }

    private ProfessorBasicDTO toProfessorBasicDTO(Professor professor) {
        if (professor == null) return null;

        String fullName = professor.getUser().getFirstName() + " " + professor.getUser().getLastName();

        return ProfessorBasicDTO.builder()
                .id(professor.getId())
                .employeeCode(professor.getEmployeeCode())
                .fullName(fullName)
                .specialization(professor.getSpecialization())
                .build();
    }
}
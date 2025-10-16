package com.university.application.mapper.impl;

import com.university.application.mapper.AcademicPeriodMapper;
import com.university.application.mapper.CourseMapper;
import com.university.application.mapper.CourseOfferingMapper;
import com.university.domain.model.CourseOffering;
import com.university.domain.model.enums.OfferingStatus;
import com.university.web.dto.courseoffering.CourseOfferingCreateRequestDTO;
import com.university.web.dto.courseoffering.CourseOfferingResponseDTO;
import com.university.web.dto.courseoffering.CourseOfferingUpdateRequestDTO;
import com.university.web.dto.professor.ProfessorBasicDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CourseOfferingMapperImpl implements CourseOfferingMapper {
    private final CourseMapper courseMapper;
    private final AcademicPeriodMapper academicPeriodMapper;

    @Override
    public CourseOffering toEntity(CourseOfferingCreateRequestDTO dto) {
        if (dto == null) return null;

        return CourseOffering.builder()
                .maxStudents(dto.getMaxStudents())
                .currentEnrollment(0)
                .status(OfferingStatus.ABIERTO)
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
                .course(courseMapper.toResponseDto(courseOffering.getCourse()))
                .academicPeriod(academicPeriodMapper.toResponseDTO(courseOffering.getAcademicPeriod()))
                .professor(toProfessorBasicDTO(courseOffering.getProfessor()))
                .build();
    }

    private ProfessorBasicDTO toProfessorBasicDTO(com.university.domain.model.Professor professor) {
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
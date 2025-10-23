package com.university.application.mapper.impl;

import com.university.application.mapper.EnrollmentMapper;
import com.university.domain.model.Enrollment;
import com.university.domain.model.enums.EnrollmentStatus;
import com.university.web.dto.courseoffering.CourseOfferingBasicDTO;
import com.university.web.dto.enrollment.EnrollmentCreateRequestDTO;
import com.university.web.dto.enrollment.EnrollmentResponseDTO;
import com.university.web.dto.enrollment.EnrollmentUpdateRequestDTO;
import com.university.web.dto.student.StudentBasicDTO;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class EnrollmentMapperImpl implements EnrollmentMapper {

    @Override
    public Enrollment toEntity(EnrollmentCreateRequestDTO dto) {
        return Enrollment.builder()
                .enrollmentDate(LocalDate.now())
                .status(EnrollmentStatus.MATRICULADO)
                .build();
    }

    @Override
    public void updateEntity(Enrollment enrollment, EnrollmentUpdateRequestDTO dto) {
        if (dto.getStatus() != null) enrollment.setStatus(dto.getStatus());
        if (dto.getFinalGrade() != null) enrollment.setFinalGrade(dto.getFinalGrade());
    }

    @Override
    public EnrollmentResponseDTO toResponseDTO(Enrollment enrollment) {
        return EnrollmentResponseDTO.builder()
                .id(enrollment.getId())
                .enrollmentDate(enrollment.getEnrollmentDate())
                .status(enrollment.getStatus())
                .finalGrade(enrollment.getFinalGrade())
                .student(toStudentBasicDTO(enrollment.getStudent()))
                .courseOffering(toCourseOfferingBasicDTO(enrollment.getCourseOffering()))
                .build();
    }

    private StudentBasicDTO toStudentBasicDTO(com.university.domain.model.Student student) {
        String fullName = student.getUser().getFirstName() + " " + student.getUser().getLastName();

        return StudentBasicDTO.builder()
                .id(student.getId())
                .studentCode(student.getStudentCode())
                .fullName(fullName)
                .currentSemester(student.getCurrentSemester())
                .build();
    }

    private CourseOfferingBasicDTO toCourseOfferingBasicDTO(com.university.domain.model.CourseOffering offering) {
        String professorName = offering.getProfessor().getUser().getFirstName() + " " +
                offering.getProfessor().getUser().getLastName();

        Integer availableSeats = offering.getMaxStudents() -
                (offering.getCurrentEnrollment() != null ? offering.getCurrentEnrollment() : 0);

        return CourseOfferingBasicDTO.builder()
                .id(offering.getId())
                .courseCode(offering.getCourse().getCourseCode())
                .courseName(offering.getCourse().getCourseName())
                .periodCode(offering.getAcademicPeriod().getPeriodCode())
                .professorName(professorName)
                .availableSeats(availableSeats)
                .build();
    }
}
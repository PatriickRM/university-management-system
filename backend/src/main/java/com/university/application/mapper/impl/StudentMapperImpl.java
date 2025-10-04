package com.university.application.mapper.impl;

import com.university.application.mapper.StudentMapper;
import com.university.application.mapper.UserMapper;
import com.university.domain.model.Career;
import com.university.domain.model.Student;
import com.university.domain.model.enums.StudentStatus;
import com.university.web.dto.career.CareerBasicDTO;
import com.university.web.dto.student.StudentCreateRequestDTO;
import com.university.web.dto.student.StudentResponseDTO;
import com.university.web.dto.student.StudentUpdateRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class StudentMapperImpl implements StudentMapper {
    private final UserMapper userMapper;

    @Override
    public Student toEntity(StudentCreateRequestDTO dto) {
        return Student.builder()
                .studentCode(dto.getStudentCode())
                .currentSemester(dto.getCurrentSemester() != null ? dto.getCurrentSemester() : 1)
                .admissionDate(dto.getAdmissionDate())
                .totalCredits(dto.getTotalCredits() != null ? dto.getTotalCredits() : 0)
                .totalDebt(dto.getTotalDebt() != null ? dto.getTotalDebt() : BigDecimal.ZERO)
                .emergencyContactPhone(dto.getEmergencyContactPhone())
                .academicStatus(StudentStatus.ACTIVO)
                .build();

    }

    @Override
    public void updateEntity(Student student, StudentUpdateRequestDTO dto) {
        if (dto.getCurrentSemester() != null) student.setCurrentSemester(dto.getCurrentSemester());
        if (dto.getTotalCredits() != null) student.setTotalCredits(dto.getTotalCredits());
        if (dto.getTotalDebt() != null) student.setTotalDebt(dto.getTotalDebt());
        if (dto.getEmergencyContactPhone() != null) student.setEmergencyContactPhone(dto.getEmergencyContactPhone());
        if (dto.getAcademicStatus() != null) student.setAcademicStatus(dto.getAcademicStatus());
    }

    @Override
    public StudentResponseDTO toResponseDTO(Student student) {
        return StudentResponseDTO.builder()
                .id(student.getId())
                .studentCode(student.getStudentCode())
                .currentSemester(student.getCurrentSemester())
                .admissionDate(student.getAdmissionDate())
                .totalCredits(student.getTotalCredits())
                .totalDebt(student.getTotalDebt())
                .emergencyContactPhone(student.getEmergencyContactPhone())
                .academicStatus(student.getAcademicStatus())
                .user(userMapper.toResponseDTO(student.getUser()))
                .career(toCareerBasicDTO(student.getCareer()))
                .build();
    }

    private CareerBasicDTO toCareerBasicDTO(Career career) {
        if (career == null) return null;

        return CareerBasicDTO.builder()
                .id(career.getId())
                .careerCode(career.getCareerCode())
                .careerName(career.getCareerName())
                .durationSemesters(career.getDurationSemesters())
                .build();
    }
}

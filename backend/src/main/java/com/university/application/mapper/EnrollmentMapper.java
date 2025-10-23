package com.university.application.mapper;

import com.university.domain.model.Enrollment;
import com.university.web.dto.enrollment.EnrollmentCreateRequestDTO;
import com.university.web.dto.enrollment.EnrollmentResponseDTO;
import com.university.web.dto.enrollment.EnrollmentUpdateRequestDTO;

public interface EnrollmentMapper {
    Enrollment toEntity(EnrollmentCreateRequestDTO dto);
    void updateEntity(Enrollment enrollment, EnrollmentUpdateRequestDTO dto);
    EnrollmentResponseDTO toResponseDTO(Enrollment enrollment);
}
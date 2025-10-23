package com.university.application.service;

import com.university.domain.model.enums.EnrollmentStatus;
import com.university.web.dto.enrollment.EnrollmentCreateRequestDTO;
import com.university.web.dto.enrollment.EnrollmentResponseDTO;
import com.university.web.dto.enrollment.EnrollmentUpdateRequestDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface EnrollmentService {

    //CRUD
    EnrollmentResponseDTO createEnrollment(EnrollmentCreateRequestDTO dto);
    EnrollmentResponseDTO getEnrollmentById(Long id);
    EnrollmentResponseDTO updateEnrollment(Long id, EnrollmentUpdateRequestDTO dto);
    void deleteEnrollment(Long id);

    // Búsquedas
    List<EnrollmentResponseDTO> getAllEnrollments();
    Page<EnrollmentResponseDTO> getAllEnrollmentsPageable(Pageable pageable);

    // Búsquedas estudiante
    List<EnrollmentResponseDTO> getEnrollmentsByStudent(Long studentId);
    List<EnrollmentResponseDTO> getEnrollmentsByStudentAndStatus(Long studentId, EnrollmentStatus status);
    List<EnrollmentResponseDTO> getEnrollmentsByStudentAndPeriod(Long studentId, Long periodId);

    // Búsquedas por oferta de curso
    List<EnrollmentResponseDTO> getEnrollmentsByCourseOffering(Long courseOfferingId);

    // Búsquedas por status
    List<EnrollmentResponseDTO> getEnrollmentsByStatus(EnrollmentStatus status);

    // Acciones especiales
    void withdrawEnrollment(Long id);
    void completeEnrollment(Long id);
    void approveEnrollment(Long id, Double finalGrade);
    void failEnrollment(Long id, Double finalGrade);
}
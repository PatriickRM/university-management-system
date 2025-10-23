package com.university.application.service.impl;

import com.university.application.exception.ErrorSistema;
import com.university.application.mapper.EnrollmentMapper;
import com.university.application.service.CourseOfferingService;
import com.university.application.service.EnrollmentService;
import com.university.application.validator.EnrollmentValidator;
import com.university.domain.model.CourseOffering;
import com.university.domain.model.Enrollment;
import com.university.domain.model.Student;
import com.university.domain.model.enums.EnrollmentStatus;
import com.university.domain.repository.CourseOfferingRepository;
import com.university.domain.repository.EnrollmentRepository;
import com.university.domain.repository.StudentRepository;
import com.university.web.dto.enrollment.EnrollmentCreateRequestDTO;
import com.university.web.dto.enrollment.EnrollmentResponseDTO;
import com.university.web.dto.enrollment.EnrollmentUpdateRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class EnrollmentServiceImpl implements EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final CourseOfferingRepository courseOfferingRepository;
    private final EnrollmentMapper enrollmentMapper;
    private final EnrollmentValidator enrollmentValidator;
    private final CourseOfferingService courseOfferingService;

    @Override
    public EnrollmentResponseDTO createEnrollment(EnrollmentCreateRequestDTO dto) {
        enrollmentValidator.validateEnrollmentCreation(dto);

        Enrollment enrollment = enrollmentMapper.toEntity(dto);

        //Asignar Student
        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new ErrorSistema("Estudiante con id no encontrado: " + dto.getStudentId()));
        enrollment.setStudent(student);

        //Asignar CourseOffering
        CourseOffering offering = courseOfferingRepository.findById(dto.getCourseOfferingId())
                .orElseThrow(() -> new ErrorSistema("Curso ofrecido con id no encontrado: " + dto.getCourseOfferingId()));
        enrollment.setCourseOffering(offering);

        //Guardar matrícula
        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);

        //Incrementar el contador de matriculados en la oferta
        courseOfferingService.incrementEnrollment(dto.getCourseOfferingId());

        return enrollmentMapper.toResponseDTO(savedEnrollment);
    }

    @Override
    @Transactional(readOnly = true)
    public EnrollmentResponseDTO getEnrollmentById(Long id) {
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new ErrorSistema("Matricula con id no encontrado: " + id));

        return enrollmentMapper.toResponseDTO(enrollment);
    }

    @Override
    public EnrollmentResponseDTO updateEnrollment(Long id, EnrollmentUpdateRequestDTO dto) {
        Enrollment existingEnrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new ErrorSistema("Matricula con id no encontrado: " + id));

        enrollmentValidator.validateEnrollmentUpdate(existingEnrollment, dto);

        enrollmentMapper.updateEntity(existingEnrollment, dto);
        Enrollment updatedEnrollment = enrollmentRepository.save(existingEnrollment);

        return enrollmentMapper.toResponseDTO(updatedEnrollment);
    }

    @Override
    public void deleteEnrollment(Long id) {
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new ErrorSistema("Matricula con id no encontrado: " + id));

        //Decrementar el contador de matriculados en la oferta
        courseOfferingService.decrementEnrollment(enrollment.getCourseOffering().getId());

        enrollmentRepository.delete(enrollment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EnrollmentResponseDTO> getAllEnrollments() {
        return enrollmentRepository.findAll().stream()
                .map(enrollmentMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EnrollmentResponseDTO> getAllEnrollmentsPageable(Pageable pageable) {
        return enrollmentRepository.findAll(pageable)
                .map(enrollmentMapper::toResponseDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EnrollmentResponseDTO> getEnrollmentsByStudent(Long studentId) {
        return enrollmentRepository.findByStudentId(studentId).stream()
                .map(enrollmentMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EnrollmentResponseDTO> getEnrollmentsByStudentAndStatus(Long studentId, EnrollmentStatus status) {
        return enrollmentRepository.findByStudentIdAndStatus(studentId, status).stream()
                .map(enrollmentMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EnrollmentResponseDTO> getEnrollmentsByStudentAndPeriod(Long studentId, Long periodId) {
        return enrollmentRepository.findByStudentAndPeriod(studentId, periodId).stream()
                .map(enrollmentMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EnrollmentResponseDTO> getEnrollmentsByCourseOffering(Long courseOfferingId) {
        return enrollmentRepository.findByCourseOfferingId(courseOfferingId).stream()
                .map(enrollmentMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EnrollmentResponseDTO> getEnrollmentsByStatus(EnrollmentStatus status) {
        return enrollmentRepository.findByStatus(status).stream()
                .map(enrollmentMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void withdrawEnrollment(Long id) {
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new ErrorSistema("Matricula con id no encontrado: " + id));

        // Validar que esté en un estado que permita retiro
        if (enrollment.getStatus() == EnrollmentStatus.COMPLETADO ||
                enrollment.getStatus() == EnrollmentStatus.RETIRADO) {
            throw new ErrorSistema("No te puedes retirar de un curso completado o ya te retiraste!");
        }

        enrollment.setStatus(EnrollmentStatus.RETIRADO);
        enrollmentRepository.save(enrollment);

        // Decrementar el contador de matriculados
        courseOfferingService.decrementEnrollment(enrollment.getCourseOffering().getId());
    }

    @Override
    public void completeEnrollment(Long id) {
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new ErrorSistema("Matricula con id no encontrado: " + id));

        enrollment.setStatus(EnrollmentStatus.COMPLETADO);
        enrollmentRepository.save(enrollment);
    }

    @Override
    public void approveEnrollment(Long id, Double finalGrade) {
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new ErrorSistema("Matricula con id no encontrado: " + id));

        enrollment.setStatus(EnrollmentStatus.APROBADO);
        enrollment.setFinalGrade(finalGrade);
        enrollmentRepository.save(enrollment);
    }

    @Override
    public void failEnrollment(Long id, Double finalGrade) {
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new ErrorSistema("Matricula con id no encontrado: " + id));

        enrollment.setStatus(EnrollmentStatus.REPROBADO);
        enrollment.setFinalGrade(finalGrade);
        enrollmentRepository.save(enrollment);
    }
}
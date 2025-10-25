package com.university.application.validator;

import com.university.application.exception.ErrorSistema;
import com.university.domain.model.CourseOffering;
import com.university.domain.model.Enrollment;
import com.university.domain.model.Student;
import com.university.domain.model.enums.EnrollmentStatus;
import com.university.domain.model.enums.OfferingStatus;
import com.university.domain.repository.CourseOfferingRepository;
import com.university.domain.repository.EnrollmentRepository;
import com.university.domain.repository.StudentRepository;
import com.university.web.dto.enrollment.EnrollmentCreateRequestDTO;
import com.university.web.dto.enrollment.EnrollmentUpdateRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EnrollmentValidator {
    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final CourseOfferingRepository courseOfferingRepository;
    private final TimeSlotValidator timeSlotValidator;

    public void validateEnrollmentCreation(EnrollmentCreateRequestDTO dto) {
        // Validar que el estudiante exista
        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new ErrorSistema("Estudiante con id no encontrado: " + dto.getStudentId()));

        // Validar que la oferta de curso exista
        CourseOffering offering = courseOfferingRepository.findById(dto.getCourseOfferingId())
                .orElseThrow(() -> new ErrorSistema("Curso ofrecido con id no encontrada: " + dto.getCourseOfferingId()));

        // Validar que la oferta esté abierta
        if (offering.getStatus() != OfferingStatus.ABIERTO) {
            throw new ErrorSistema("Curso ofrecido no se encuentra disponible. Status: " + offering.getStatus());
        }

        // Validar que haya cupos disponibles
        if (offering.getCurrentEnrollment() >= offering.getMaxStudents()) {
            throw new ErrorSistema("Curso ofrecido esta lleno, no quedan cupos disponibles.");
        }

        // Validar que el estudiante no esté ya matriculado en esta oferta
        if (enrollmentRepository.existsByStudentIdAndCourseOfferingId(dto.getStudentId(), dto.getCourseOfferingId())) {
            throw new ErrorSistema("Estudiante ya esta matriculado en este curso");
        }

        //Validar créditos máximos por período (24 créditos)
        Long currentCredits = enrollmentRepository.countCreditsByStudentAndPeriod(dto.getStudentId(), offering.getAcademicPeriod().getId());
        if (currentCredits == null) currentCredits = 0L;
        if (currentCredits + offering.getCourse().getCredits() > 24) {
            throw new ErrorSistema(String.format("No puedes matricularte en más de 24 créditos por período. Actualmente tienes %d créditos", currentCredits));
        }

        //Validar conflictos de horario para el estudiante
        if (offering.getTimeSlots() != null && !offering.getTimeSlots().isEmpty()) {
            timeSlotValidator.validateNoConflictsForStudent(
                    dto.getStudentId(),
                    offering.getAcademicPeriod().getId(),
                    offering.getTimeSlots()
            );
        }
    }

    public void validateEnrollmentUpdate(Enrollment enrollment, EnrollmentUpdateRequestDTO dto) {
        // Validar que si se asigna calificación, el curso debe estar completado
        if (dto.getFinalGrade() != null && enrollment.getStatus() != EnrollmentStatus.COMPLETADO) {
            throw new ErrorSistema("Asignar calificacion si curso esta completado");
        }
    }
}
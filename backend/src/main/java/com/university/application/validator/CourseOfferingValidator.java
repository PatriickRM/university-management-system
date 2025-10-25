package com.university.application.validator;

import com.university.application.exception.ErrorSistema;
import com.university.domain.model.CourseOffering;
import com.university.domain.repository.*;
import com.university.web.dto.courseoffering.CourseOfferingCreateRequestDTO;
import com.university.web.dto.courseoffering.CourseOfferingUpdateRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CourseOfferingValidator {

    private final CourseOfferingRepository courseOfferingRepository;
    private final CourseRepository courseRepository;
    private final AcademicPeriodRepository academicPeriodRepository;
    private final ProfessorRepository professorRepository;
    private final TimeSlotValidator timeSlotValidator;

    public void validateCourseOfferingCreation(CourseOfferingCreateRequestDTO dto) {
        // Validar que el curso exista
        if (!courseRepository.existsById(dto.getCourseId())) {
            throw new ErrorSistema("Curso con ID no encontrada: " + dto.getCourseId());
        }

        // Validar que el período académico exista
        if (!academicPeriodRepository.existsById(dto.getAcademicPeriodId())) {
            throw new ErrorSistema("Periodo con ID Académico no encontrado: " + dto.getAcademicPeriodId());
        }

        // Validar que el profesor exista
        if (!professorRepository.existsById(dto.getProfessorId())) {
            throw new ErrorSistema("Profesor con ID no encontrada: " + dto.getProfessorId());
        }

        // Validar que no exista ya una oferta del mismo curso en el mismo período
        courseOfferingRepository.findByCourseAndPeriod(dto.getCourseId(), dto.getAcademicPeriodId())
                .ifPresent(offering -> {
                    throw new ErrorSistema("Oferta de curso ya existente en el mismo periodo");
                });

        //Validar franjas horarias
        if (dto.getTimeSlots() == null || dto.getTimeSlots().isEmpty()) {
            throw new ErrorSistema("Debe incluir al menos una franja horaria");
        }

        //Validar cada franja horaria individualmente
        dto.getTimeSlots().forEach(timeSlotValidator::validateTimeSlotCreation);
    }

    public void validateCourseOfferingUpdate(CourseOffering courseOffering, CourseOfferingUpdateRequestDTO dto) {
        // Validar que el profesor exista si se está actualizando
        if (dto.getProfessorId() != null && !professorRepository.existsById(dto.getProfessorId())) {
            throw new ErrorSistema("Profesor con ID no encontrada: " + dto.getProfessorId());
        }

        // Validar que el nuevo maxStudents sea mayor o igual al número actual de matriculados
        if (dto.getMaxStudents() != null && dto.getMaxStudents() < courseOffering.getCurrentEnrollment()) {
            throw new ErrorSistema("El maximo de estudiantes no puede ser menor que el numero actual de matriculados: " + courseOffering.getCurrentEnrollment());
        }
    }
}

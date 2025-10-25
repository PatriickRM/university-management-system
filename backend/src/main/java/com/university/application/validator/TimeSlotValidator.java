package com.university.application.validator;

import com.university.application.exception.ErrorSistema;
import com.university.domain.model.CourseOffering;
import com.university.domain.model.TimeSlot;
import com.university.domain.repository.TimeSlotRepository;
import com.university.web.dto.timeslot.TimeSlotCreateRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class TimeSlotValidator {

    private final TimeSlotRepository timeSlotRepository;

    public void validateTimeSlotCreation(TimeSlotCreateRequestDTO dto) {
        //Validar que la hora de inicio sea antes de la hora de fin
        if (!dto.getStartTime().isBefore(dto.getEndTime())) {
            throw new ErrorSistema("La hora de inicio debe ser anterior a la hora de fin");
        }

        //Validar que la duración sea de al menos 1 hora
        long minutes = java.time.Duration.between(dto.getStartTime(), dto.getEndTime()).toMinutes();
        if (minutes < 60) {
            throw new ErrorSistema("La duración mínima de una clase debe ser de 1 hora");
        }

        //Validar que no exceda 4 horas por sesión
        if (minutes > 240) {
            throw new ErrorSistema("La duración máxima de una clase es de 4 horas");
        }

        // Validar horario válido (7:00 AM - 10:00 PM)
        LocalTime minTime = LocalTime.of(7, 0);
        LocalTime maxTime = LocalTime.of(22, 0);

        if (dto.getStartTime().isBefore(minTime) || dto.getEndTime().isAfter(maxTime)) {
            throw new ErrorSistema("El horario debe estar entre 7:00 AM y 10:00 PM");
        }
    }

    public void validateTotalWeeklyHours(CourseOffering courseOffering, List<TimeSlotCreateRequestDTO> newTimeSlots) {
        //Calcular total de horas propuestas
        double totalHours = newTimeSlots.stream()
                .mapToDouble(ts -> {
                    long minutes = java.time.Duration.between(ts.getStartTime(), ts.getEndTime()).toMinutes();
                    return minutes / 60.0;
                })
                .sum();

        //Validar que sea exactamente 6 horas semanales
        if (Math.abs(totalHours - 6.0) > 0.01) {
            throw new ErrorSistema(
                    String.format("El total de horas semanales debe ser exactamente 6. Actualmente: %.2f horas", totalHours)
            );
        }

        // Validar que haya al menos 2 sesiones
        if (newTimeSlots.size() < 2) {
            throw new ErrorSistema("Se requieren al menos 2 sesiones por semana");
        }

        // Validar que no haya más de 4 sesiones
        if (newTimeSlots.size() > 4) {
            throw new ErrorSistema("No se permiten más de 4 sesiones por semana");
        }
    }

    public void validateNoConflictsForProfessor(CourseOffering courseOffering, List<TimeSlotCreateRequestDTO> timeSlots) {
        for (TimeSlotCreateRequestDTO slot : timeSlots) {
            List<TimeSlot> conflicts = timeSlotRepository.findConflictingTimeSlotsForProfessor(
                    courseOffering.getProfessor().getId(),
                    courseOffering.getAcademicPeriod().getId(),
                    courseOffering.getId(),
                    slot.getDayOfWeek(),
                    slot.getStartTime(),
                    slot.getEndTime()
            );

            if (!conflicts.isEmpty()) {
                TimeSlot conflict = conflicts.get(0);
                throw new ErrorSistema(
                        String.format("El profesor tiene conflicto de horario el %s de %s a %s con el curso %s",
                                slot.getDayOfWeek(),
                                slot.getStartTime(),
                                slot.getEndTime(),
                                conflict.getCourseOffering().getCourse().getCourseName()
                        )
                );
            }
        }
    }

    public void validateNoConflictsForClassroom(CourseOffering courseOffering, List<TimeSlotCreateRequestDTO> timeSlots) {
        for (TimeSlotCreateRequestDTO slot : timeSlots) {
            List<TimeSlot> conflicts = timeSlotRepository.findConflictingTimeSlotsForClassroom(
                    courseOffering.getAcademicPeriod().getId(),
                    courseOffering.getId(),
                    slot.getClassroom(),
                    slot.getDayOfWeek(),
                    slot.getStartTime(),
                    slot.getEndTime()
            );

            if (!conflicts.isEmpty()) {
                TimeSlot conflict = conflicts.get(0);
                throw new ErrorSistema(
                        String.format("El aula %s ya está ocupada el %s de %s a %s por el curso %s",
                                slot.getClassroom(),
                                slot.getDayOfWeek(),
                                slot.getStartTime(),
                                slot.getEndTime(),
                                conflict.getCourseOffering().getCourse().getCourseName()
                        )
                );
            }
        }
    }

    public void validateNoConflictsForStudent(Long studentId, Long periodId, List<TimeSlot> proposedTimeSlots) {
        for (TimeSlot slot : proposedTimeSlots) {
            List<TimeSlot> conflicts = timeSlotRepository.findConflictingTimeSlotsForStudent(
                    studentId,
                    periodId,
                    slot.getDayOfWeek(),
                    slot.getStartTime(),
                    slot.getEndTime()
            );

            if (!conflicts.isEmpty()) {
                TimeSlot conflict = conflicts.get(0);
                throw new ErrorSistema(
                        String.format("Tienes conflicto de horario el %s de %s a %s con el curso %s",
                                slot.getDayOfWeek(),
                                slot.getStartTime(),
                                slot.getEndTime(),
                                conflict.getCourseOffering().getCourse().getCourseName()
                        )
                );
            }
        }
    }
}

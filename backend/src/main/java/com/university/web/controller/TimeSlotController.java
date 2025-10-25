package com.university.web.controller;

import com.university.application.service.TimeSlotService;
import com.university.web.dto.schedule.ScheduleResponseDTO;
import com.university.web.dto.timeslot.TimeSlotResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/time-slots")
@RequiredArgsConstructor
public class TimeSlotController {
    private final TimeSlotService timeSlotService;

    //Obtener franjas horarias de una oferta de curso
    @GetMapping("/course-offering/{courseOfferingId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TimeSlotResponseDTO>> getTimeSlotsByCourseOffering(@PathVariable Long courseOfferingId) {
        List<TimeSlotResponseDTO> response = timeSlotService.getTimeSlotsByCourseOffering(courseOfferingId);
        return ResponseEntity.ok(response);
    }

    //Obtener horario de un estudiante en un período
    @GetMapping("/student/{studentId}/period/{periodId}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurityService.isStudentOwner(#studentId)")
    public ResponseEntity<List<ScheduleResponseDTO>> getStudentSchedule(@PathVariable Long studentId, @PathVariable Long periodId
    ) {
        List<ScheduleResponseDTO> response = timeSlotService.getStudentSchedule(studentId, periodId);
        return ResponseEntity.ok(response);
    }

    //Obtener horario de un profesor en un período
    @GetMapping("/professor/{professorId}/period/{periodId}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurityService.isProfessorOwner(#professorId)")
    public ResponseEntity<List<ScheduleResponseDTO>> getProfessorSchedule(@PathVariable Long professorId, @PathVariable Long periodId
    ) {
        List<ScheduleResponseDTO> response = timeSlotService.getProfessorSchedule(professorId, periodId);
        return ResponseEntity.ok(response);
    }

    //Eliminar franja horaria
    @DeleteMapping("/{timeSlotId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteTimeSlot(@PathVariable Long timeSlotId) {
        timeSlotService.deleteTimeSlot(timeSlotId);
        return ResponseEntity.ok(Map.of("mensaje", "Franja horaria eliminada correctamente"));
    }
}
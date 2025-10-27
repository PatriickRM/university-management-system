package com.university.web.controller;

import com.university.application.service.EnrollmentService;
import com.university.application.service.impl.ScheduledTasksService;
import com.university.domain.model.enums.EnrollmentStatus;
import com.university.web.dto.enrollment.EnrollmentCreateRequestDTO;
import com.university.web.dto.enrollment.EnrollmentResponseDTO;
import com.university.web.dto.enrollment.EnrollmentUpdateRequestDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {
    private final EnrollmentService enrollmentService;
    private final ScheduledTasksService scheduledTasksService;

    // Crear matrícula
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or @enrollmentSecurityService.canEnroll(#dto.studentId)")
    public ResponseEntity<EnrollmentResponseDTO> createEnrollment(@Valid @RequestBody EnrollmentCreateRequestDTO dto) {
        EnrollmentResponseDTO response = enrollmentService.createEnrollment(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Obtener matrícula por ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR') or @enrollmentSecurityService.isEnrollmentOwner(#id)")
    public ResponseEntity<EnrollmentResponseDTO> getEnrollmentById(@PathVariable Long id) {
        EnrollmentResponseDTO response = enrollmentService.getEnrollmentById(id);
        return ResponseEntity.ok(response);
    }

    // Obtener todas las matrículas
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EnrollmentResponseDTO>> getAllEnrollments() {
        List<EnrollmentResponseDTO> response = enrollmentService.getAllEnrollments();
        return ResponseEntity.ok(response);
    }

    //Obtener matrículas paginadas
    @GetMapping("/paginated")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<EnrollmentResponseDTO>> getAllEnrollmentsPageable(
            @PageableDefault(size = 10, sort = "enrollmentDate", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<EnrollmentResponseDTO> response = enrollmentService.getAllEnrollmentsPageable(pageable);
        return ResponseEntity.ok(response);
    }

    //Obtener matrículas de un estudiante
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurityService.isStudentOwner(#studentId)")
    public ResponseEntity<List<EnrollmentResponseDTO>> getEnrollmentsByStudent(@PathVariable Long studentId) {
        List<EnrollmentResponseDTO> response = enrollmentService.getEnrollmentsByStudent(studentId);
        return ResponseEntity.ok(response);
    }

    //Obtener matrículas de un estudiante por status - ADMIN o el mismo estudiante
    @GetMapping("/student/{studentId}/status/{status}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurityService.isStudentOwner(#studentId)")
    public ResponseEntity<List<EnrollmentResponseDTO>> getEnrollmentsByStudentAndStatus(@PathVariable Long studentId,
                                                                                        @PathVariable EnrollmentStatus status) {
        List<EnrollmentResponseDTO> response = enrollmentService.getEnrollmentsByStudentAndStatus(studentId, status);
        return ResponseEntity.ok(response);
    }

    //Obtener matrículas de un estudiante en un período - ADMIN o el mismo estudiante
    @GetMapping("/student/{studentId}/period/{periodId}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurityService.isStudentOwner(#studentId)")
    public ResponseEntity<List<EnrollmentResponseDTO>> getEnrollmentsByStudentAndPeriod(
            @PathVariable Long studentId,
            @PathVariable Long periodId
    ) {
        List<EnrollmentResponseDTO> response = enrollmentService.getEnrollmentsByStudentAndPeriod(studentId, periodId);
        return ResponseEntity.ok(response);
    }

    //Obtener matrículas de una oferta de curso - ADMIN o PROFESSOR de esa oferta
    @GetMapping("/course-offering/{courseOfferingId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR')")
    public ResponseEntity<List<EnrollmentResponseDTO>> getEnrollmentsByCourseOffering(
            @PathVariable Long courseOfferingId
    ) {
        List<EnrollmentResponseDTO> response = enrollmentService.getEnrollmentsByCourseOffering(courseOfferingId);
        return ResponseEntity.ok(response);
    }

    //Obtener matrículas por status - Solo ADMIN
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EnrollmentResponseDTO>> getEnrollmentsByStatus(@PathVariable EnrollmentStatus status) {
        List<EnrollmentResponseDTO> response = enrollmentService.getEnrollmentsByStatus(status);
        return ResponseEntity.ok(response);
    }

    //Actualizar matrícula
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR')")
    public ResponseEntity<EnrollmentResponseDTO> updateEnrollment(@PathVariable Long id, @Valid @RequestBody EnrollmentUpdateRequestDTO dto) {
        EnrollmentResponseDTO response = enrollmentService.updateEnrollment(id, dto);
        return ResponseEntity.ok(response);
    }

    //Retirar matrícula - ADMIN o el mismo estudiante
    @PatchMapping("/{id}/withdraw")
    @PreAuthorize("hasRole('ADMIN') or @enrollmentSecurityService.isEnrollmentOwner(#id)")
    public ResponseEntity<EnrollmentResponseDTO> withdrawEnrollment(@PathVariable Long id) {
        enrollmentService.withdrawEnrollment(id);
        EnrollmentResponseDTO response = enrollmentService.getEnrollmentById(id);
        return ResponseEntity.ok(response);
    }

    //Completar matrícula (curso finalizó)
    @PatchMapping("/{id}/complete")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR')")
    public ResponseEntity<EnrollmentResponseDTO> completeEnrollment(@PathVariable Long id) {
        enrollmentService.completeEnrollment(id);
        EnrollmentResponseDTO response = enrollmentService.getEnrollmentById(id);
        return ResponseEntity.ok(response);
    }

    //Aprobar matrícula con calificación
    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR')")
    public ResponseEntity<EnrollmentResponseDTO> approveEnrollment(
            @PathVariable Long id,
            @RequestParam Double finalGrade
    ) {
        enrollmentService.approveEnrollment(id, finalGrade);
        EnrollmentResponseDTO response = enrollmentService.getEnrollmentById(id);
        return ResponseEntity.ok(response);
    }

    //Desaprobar matrícula con calificación Solo ADMIN o PROFESSOR
    @PatchMapping("/{id}/fail")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR')")
    public ResponseEntity<EnrollmentResponseDTO> failEnrollment(
            @PathVariable Long id,
            @RequestParam Double finalGrade
    ) {
        enrollmentService.failEnrollment(id, finalGrade);
        EnrollmentResponseDTO response = enrollmentService.getEnrollmentById(id);
        return ResponseEntity.ok(response);
    }

    //Eliminar matrícula
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteEnrollment(@PathVariable Long id) {
        enrollmentService.deleteEnrollment(id);
        return ResponseEntity.ok(Map.of("mensaje", "Matrícula eliminada correctamente"));
    }

    @PostMapping("/sync-statuses")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> syncEnrollmentStatuses() {
        scheduledTasksService.updateEnrollmentStatuses();
        return ResponseEntity.ok(Map.of("mensaje", "Estados sincronizados correctamente"));
    }

}
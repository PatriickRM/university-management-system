package com.university.web.controller;

import com.university.application.service.CourseOfferingService;
import com.university.domain.model.enums.OfferingStatus;
import com.university.web.dto.courseoffering.CourseOfferingCreateRequestDTO;
import com.university.web.dto.courseoffering.CourseOfferingResponseDTO;
import com.university.web.dto.courseoffering.CourseOfferingUpdateRequestDTO;
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
@RequestMapping("/api/course-offerings")
@RequiredArgsConstructor
public class CourseOfferingController {
    private final CourseOfferingService courseOfferingService;

    // Crear oferta de curso
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CourseOfferingResponseDTO> createCourseOffering(@Valid @RequestBody CourseOfferingCreateRequestDTO dto) {
        CourseOfferingResponseDTO response = courseOfferingService.createCourseOffering(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Obtener oferta por ID
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CourseOfferingResponseDTO> getCourseOfferingById(@PathVariable Long id) {
        CourseOfferingResponseDTO response = courseOfferingService.getCourseOfferingById(id);
        return ResponseEntity.ok(response);
    }

    // Obtener todas las ofertas
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR')")
    public ResponseEntity<List<CourseOfferingResponseDTO>> getAllCourseOfferings() {
        List<CourseOfferingResponseDTO> response = courseOfferingService.getAllCourseOfferings();
        return ResponseEntity.ok(response);
    }

    // Obtener ofertas paginadas
    @GetMapping("/paginated")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR')")
    public ResponseEntity<Page<CourseOfferingResponseDTO>> getAllCourseOfferingsPageable(
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<CourseOfferingResponseDTO> response = courseOfferingService.getAllCourseOfferingsPageable(pageable);
        return ResponseEntity.ok(response);
    }

    // Buscar ofertas por período académico
    @GetMapping("/period/{academicPeriodId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<CourseOfferingResponseDTO>> getCourseOfferingsByPeriod(
            @PathVariable Long academicPeriodId
    ) {
        List<CourseOfferingResponseDTO> response = courseOfferingService.getCourseOfferingsByPeriod(academicPeriodId);
        return ResponseEntity.ok(response);
    }

    // Buscar ofertas por curso
    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR')")
    public ResponseEntity<List<CourseOfferingResponseDTO>> getCourseOfferingsByCourse(@PathVariable Long courseId) {
        List<CourseOfferingResponseDTO> response = courseOfferingService.getCourseOfferingsByCourse(courseId);
        return ResponseEntity.ok(response);
    }

    // Buscar ofertas por profesor (ADMIN Y PROFESSOR puede ver las suyas)
    @GetMapping("/professor/{professorId}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurityService.isProfessorOwner(#professorId)")
    public ResponseEntity<List<CourseOfferingResponseDTO>> getCourseOfferingsByProfessor(@PathVariable Long professorId) {
        List<CourseOfferingResponseDTO> response = courseOfferingService.getCourseOfferingsByProfessor(professorId);
        return ResponseEntity.ok(response);
    }

    // Buscar ofertas por status
    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR')")
    public ResponseEntity<List<CourseOfferingResponseDTO>> getCourseOfferingsByStatus(@PathVariable OfferingStatus status) {
        List<CourseOfferingResponseDTO> response = courseOfferingService.getCourseOfferingsByStatus(status);
        return ResponseEntity.ok(response);
    }

    // Buscar ofertas abiertas por período (Todos autenticados para matrícula)
    @GetMapping("/period/{academicPeriodId}/open")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<CourseOfferingResponseDTO>> getOpenOfferingsByPeriod(@PathVariable Long academicPeriodId) {
        List<CourseOfferingResponseDTO> response = courseOfferingService.getOpenOfferingsByPeriod(academicPeriodId);
        return ResponseEntity.ok(response);
    }

    // Buscar ofertas con cupos disponibles
    @GetMapping("/available")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<CourseOfferingResponseDTO>> getAvailableOfferings() {
        List<CourseOfferingResponseDTO> response = courseOfferingService.getAvailableOfferings();
        return ResponseEntity.ok(response);
    }

    // Buscar ofertas de un profesor en un período
    @GetMapping("/professor/{professorId}/period/{periodId}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurityService.isProfessorOwner(#professorId)")
    public ResponseEntity<List<CourseOfferingResponseDTO>> getCourseOfferingsByProfessorAndPeriod(@PathVariable Long professorId, @PathVariable Long periodId) {
        List<CourseOfferingResponseDTO> response = courseOfferingService.getCourseOfferingsByProfessorAndPeriod(professorId, periodId);
        return ResponseEntity.ok(response);
    }

    // Actualizar oferta
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CourseOfferingResponseDTO> updateCourseOffering(@PathVariable Long id, @Valid @RequestBody CourseOfferingUpdateRequestDTO dto) {
        CourseOfferingResponseDTO response = courseOfferingService.updateCourseOffering(id, dto);
        return ResponseEntity.ok(response);
    }

    // Abrir oferta
    @PatchMapping("/{id}/open")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CourseOfferingResponseDTO> openOffering(@PathVariable Long id) {
        courseOfferingService.openOffering(id);
        CourseOfferingResponseDTO response = courseOfferingService.getCourseOfferingById(id);
        return ResponseEntity.ok(response);
    }

    // Cerrar oferta
    @PatchMapping("/{id}/close")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CourseOfferingResponseDTO> closeOffering(@PathVariable Long id) {
        courseOfferingService.closeOffering(id);
        CourseOfferingResponseDTO response = courseOfferingService.getCourseOfferingById(id);
        return ResponseEntity.ok(response);
    }

    // Iniciar oferta (curso comienza)
    @PatchMapping("/{id}/start")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CourseOfferingResponseDTO> startOffering(@PathVariable Long id) {
        courseOfferingService.startOffering(id);
        CourseOfferingResponseDTO response = courseOfferingService.getCourseOfferingById(id);
        return ResponseEntity.ok(response);
    }

    // Completar oferta (curso termina)
    @PatchMapping("/{id}/complete")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CourseOfferingResponseDTO> completeOffering(@PathVariable Long id) {
        courseOfferingService.completeOffering(id);
        CourseOfferingResponseDTO response = courseOfferingService.getCourseOfferingById(id);
        return ResponseEntity.ok(response);
    }

    // Cancelar oferta
    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CourseOfferingResponseDTO> cancelOffering(@PathVariable Long id) {
        courseOfferingService.cancelOffering(id);
        CourseOfferingResponseDTO response = courseOfferingService.getCourseOfferingById(id);
        return ResponseEntity.ok(response);
    }

    // Eliminar oferta
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteCourseOffering(@PathVariable Long id) {
        courseOfferingService.deleteCourseOffering(id);
        return ResponseEntity.ok(Map.of("mensaje", "Oferta de curso eliminada correctamente"));
    }
}
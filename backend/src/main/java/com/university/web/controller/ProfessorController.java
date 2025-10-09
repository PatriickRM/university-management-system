package com.university.web.controller;

import com.university.application.service.ProfessorService;
import com.university.domain.model.enums.EmploymentType;
import com.university.domain.model.enums.ProfessorStatus;
import com.university.web.dto.professor.ProfessorCreateRequestDTO;
import com.university.web.dto.professor.ProfessorResponseDTO;
import com.university.web.dto.professor.ProfessorUpdateRequestDTO;
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
@RequestMapping("/api/professors")
@RequiredArgsConstructor
public class ProfessorController {

    private final ProfessorService professorService;

    // Crear profesor
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProfessorResponseDTO> createProfessor(@Valid @RequestBody ProfessorCreateRequestDTO dto) {
        ProfessorResponseDTO response = professorService.createProfessor(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Obtener profesor por ID (Admin o mismo profesor)
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurityService.isProfessorOwner(#id)")
    public ResponseEntity<ProfessorResponseDTO> getProfessorById(@PathVariable Long id) {
        ProfessorResponseDTO response = professorService.getProfessorById(id);
        return ResponseEntity.ok(response);
    }

    // Obtener todos los profesores
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ProfessorResponseDTO>> getAllProfessors() {
        List<ProfessorResponseDTO> response = professorService.getAllProfessors();
        return ResponseEntity.ok(response);
    }

    // Obtener profesores paginados
    @GetMapping("/paginated")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<ProfessorResponseDTO>> getAllProfessorsPageable(
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.ASC) Pageable pageable
    ) {
        Page<ProfessorResponseDTO> response = professorService.getAllProfessorsPageable(pageable);
        return ResponseEntity.ok(response);
    }

    // Buscar profesor por código (Admin o mismo profesor)
    @GetMapping("/code/{employeeCode}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurityService.isProfessorOwnerByCode(#employeeCode)")
    public ResponseEntity<ProfessorResponseDTO> getProfessorByEmployeeCode(@PathVariable String employeeCode) {
        ProfessorResponseDTO response = professorService.getProfessorByEmployeeCode(employeeCode);
        return ResponseEntity.ok(response);
    }

    // Buscar profesor por user ID (Admin o mismo usuario)
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurityService.isOwner(#userId)")
    public ResponseEntity<ProfessorResponseDTO> getProfessorByUserId(@PathVariable Long userId) {
        ProfessorResponseDTO response = professorService.getProfessorByUserId(userId);
        return ResponseEntity.ok(response);
    }

    // Buscar profesor por email
    @GetMapping("/email")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProfessorResponseDTO> getProfessorByUserEmail(@RequestParam String email) {
        ProfessorResponseDTO response = professorService.getProfessorByUserEmail(email);
        return ResponseEntity.ok(response);
    }

    // Buscar profesores por departamento
    @GetMapping("/department/{departmentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ProfessorResponseDTO>> getProfessorsByDepartment(@PathVariable Long departmentId) {
        List<ProfessorResponseDTO> response = professorService.getProfessorsByDepartment(departmentId);
        return ResponseEntity.ok(response);
    }

    // Buscar profesores por status
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ProfessorResponseDTO>> getProfessorsByStatus(@PathVariable ProfessorStatus status) {
        List<ProfessorResponseDTO> response = professorService.getProfessorsByStatus(status);
        return ResponseEntity.ok(response);
    }

    // Buscar profesores por tipo de empleo
    @GetMapping("/employment-type/{employmentType}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ProfessorResponseDTO>> getProfessorsByEmploymentType(
            @PathVariable EmploymentType employmentType
    ) {
        List<ProfessorResponseDTO> response = professorService.getProfessorsByEmploymentType(employmentType);
        return ResponseEntity.ok(response);
    }

    // Buscar profesores por especialización
    @GetMapping("/specialization")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ProfessorResponseDTO>> getProfessorsBySpecialization(
            @RequestParam String specialization
    ) {
        List<ProfessorResponseDTO> response = professorService.getProfessorsBySpecialization(specialization);
        return ResponseEntity.ok(response);
    }

    // Actualizar profesor
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurityService.isProfessorOwner(#id)")
    public ResponseEntity<ProfessorResponseDTO> updateProfessor(
            @PathVariable Long id,
            @Valid @RequestBody ProfessorUpdateRequestDTO dto
    ) {
        ProfessorResponseDTO response = professorService.updateProfessor(id, dto);
        return ResponseEntity.ok(response);
    }

    // Eliminar profesor (soft delete)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteProfessor(@PathVariable Long id) {
        professorService.deleteProfessor(id);
        return ResponseEntity.ok(Map.of("mensaje", "Profesor puesto en inactivo correctamente"));
    }
}
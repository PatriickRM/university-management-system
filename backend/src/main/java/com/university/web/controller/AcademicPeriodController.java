package com.university.web.controller;

import com.university.application.service.AcademicPeriodService;
import com.university.domain.model.enums.PeriodStatus;
import com.university.web.dto.academicperiod.AcademicPeriodCreateRequestDTO;
import com.university.web.dto.academicperiod.AcademicPeriodResponseDTO;
import com.university.web.dto.academicperiod.AcademicPeriodUpdateRequestDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/academic-periods")
@RequiredArgsConstructor
public class AcademicPeriodController {

    private final AcademicPeriodService academicPeriodService;

    //Crear período académico - Solo ADMIN
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AcademicPeriodResponseDTO> createAcademicPeriod(
            @Valid @RequestBody AcademicPeriodCreateRequestDTO dto
    ) {
        AcademicPeriodResponseDTO response = academicPeriodService.createAcademicPeriod(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    //Obtener período por ID (ADMIN Y PROFESSOR)
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR')")
    public ResponseEntity<AcademicPeriodResponseDTO> getAcademicPeriodById(@PathVariable Long id) {
        AcademicPeriodResponseDTO response = academicPeriodService.getAcademicPeriodById(id);
        return ResponseEntity.ok(response);
    }

    //Obtener todos los períodos (ADMIN Y PROFESSOR)
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR')")
    public ResponseEntity<List<AcademicPeriodResponseDTO>> getAllAcademicPeriods() {
        List<AcademicPeriodResponseDTO> response = academicPeriodService.getAllAcademicPeriods();
        return ResponseEntity.ok(response);
    }

    //Obtener períodos paginados (ADMIN Y PROFESSOR)
    @GetMapping("/paginated")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR')")
    public ResponseEntity<Page<AcademicPeriodResponseDTO>> getAllAcademicPeriodsPageable(
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<AcademicPeriodResponseDTO> response = academicPeriodService.getAllAcademicPeriodsPageable(pageable);
        return ResponseEntity.ok(response);
    }

    //Buscar período por código (ADMIN Y PROFESSOR)
    @GetMapping("/code/{periodCode}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR')")
    public ResponseEntity<AcademicPeriodResponseDTO> getAcademicPeriodByCode(@PathVariable String periodCode) {
        AcademicPeriodResponseDTO response = academicPeriodService.getAcademicPeriodByCode(periodCode);
        return ResponseEntity.ok(response);
    }

    //Buscar períodos por status (ADMIN Y PROFESSOR)
    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR')")
    public ResponseEntity<List<AcademicPeriodResponseDTO>> getAcademicPeriodsByStatus(
            @PathVariable PeriodStatus status
    ) {
        List<AcademicPeriodResponseDTO> response = academicPeriodService.getAcademicPeriodsByStatus(status);
        return ResponseEntity.ok(response);
    }

    //Buscar períodos por año (ADMIN Y PROFESSOR)
    @GetMapping("/year/{year}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR')")
    public ResponseEntity<List<AcademicPeriodResponseDTO>> getAcademicPeriodsByYear(@PathVariable String year) {
        List<AcademicPeriodResponseDTO> response = academicPeriodService.getAcademicPeriodsByYear(year);
        return ResponseEntity.ok(response);
    }

    //Obtener período activo actual - Todos los autenticados
    @GetMapping("/active")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AcademicPeriodResponseDTO> getActivePeriod() {
        AcademicPeriodResponseDTO response = academicPeriodService.getActivePeriod();
        return ResponseEntity.ok(response);
    }

    //Obtener período por fecha (ADMIN Y PROFESSOR)
    @GetMapping("/by-date")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR')")
    public ResponseEntity<AcademicPeriodResponseDTO> getPeriodByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        AcademicPeriodResponseDTO response = academicPeriodService.getPeriodByDate(date);
        return ResponseEntity.ok(response);
    }

    //Actualizar período
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AcademicPeriodResponseDTO> updateAcademicPeriod(
            @PathVariable Long id,
            @Valid @RequestBody AcademicPeriodUpdateRequestDTO dto
    ) {
        AcademicPeriodResponseDTO response = academicPeriodService.updateAcademicPeriod(id, dto);
        return ResponseEntity.ok(response);
    }

    //Eliminar periodo
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteAcademicPeriod(@PathVariable Long id) {
        academicPeriodService.deleteAcademicPeriod(id);
        return ResponseEntity.ok(Map.of("mensaje", "Período académico eliminado correctamente"));
    }
}
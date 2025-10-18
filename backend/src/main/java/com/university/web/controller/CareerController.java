package com.university.web.controller;

import com.university.application.service.CareerService;
import com.university.domain.model.enums.CareerStatus;
import com.university.web.dto.career.CareerCreateRequestDTO;
import com.university.web.dto.career.CareerResponseDTO;
import com.university.web.dto.career.CareerUpdateRequestDTO;
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
@RequestMapping("/api/careers")
@RequiredArgsConstructor
public class CareerController {
    private final CareerService careerService;

    //Crear carrera
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CareerResponseDTO> createCareer(@Valid @RequestBody CareerCreateRequestDTO dto) {
        CareerResponseDTO response = careerService.createCareer(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CareerResponseDTO> getCareerById(@PathVariable Long id) {
        CareerResponseDTO response = careerService.getCareerById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<CareerResponseDTO>> getAllCareers() {
        List<CareerResponseDTO> response = careerService.getAllCareers();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/paginated")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<CareerResponseDTO>> getAllCareersPageable(@PageableDefault(size = 10, sort = "careerName",
            direction = Sort.Direction.ASC) Pageable pageable) {
        Page<CareerResponseDTO> response = careerService.getAllCareersPageable(pageable);
        return ResponseEntity.ok(response);
    }

    // Buscar carrera por código
    @GetMapping("/code/{careerCode}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CareerResponseDTO> getCareerByCode(@PathVariable String careerCode) {
        CareerResponseDTO response = careerService.getCareerByCode(careerCode);
        return ResponseEntity.ok(response);
    }

    // Buscar carreras por status
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CareerResponseDTO>> getCareersByStatus(@PathVariable CareerStatus status) {
        List<CareerResponseDTO> response = careerService.getCareersByStatus(status);
        return ResponseEntity.ok(response);
    }

    // Buscar carreras por departamento
    @GetMapping("/department/{departmentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<CareerResponseDTO>> getCareersByDepartment(@PathVariable Long departmentId) {
        List<CareerResponseDTO> response = careerService.getCareersByDepartment(departmentId);
        return ResponseEntity.ok(response);
    }

    // Buscar carreras activas por departamento
    @GetMapping("/department/{departmentId}/active")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<CareerResponseDTO>> getActiveCareersByDepartment(@PathVariable Long departmentId) {
        List<CareerResponseDTO> response = careerService.getActiveCareersByDepartment(departmentId);
        return ResponseEntity.ok(response);
    }

    // Buscar carreras por nombre
    @GetMapping("/search")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<CareerResponseDTO>> searchCareersByName(@RequestParam String name) {
        List<CareerResponseDTO> response = careerService.searchCareersByName(name);
        return ResponseEntity.ok(response);
    }

    // Actualizar carrera
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CareerResponseDTO> updateCareer(@PathVariable Long id, @Valid @RequestBody CareerUpdateRequestDTO dto) {
        CareerResponseDTO response = careerService.updateCareer(id, dto);
        return ResponseEntity.ok(response);
    }

    // Eliminar carrera
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteCareer(@PathVariable Long id) {
        careerService.deleteCareer(id);
        return ResponseEntity.ok(Map.of("mensaje", "Carrera eliminada correctamente"));

    }
}
package com.university.web.controller;

import com.university.application.service.DepartmentService;
import com.university.domain.model.Department;
import com.university.domain.model.enums.DepartmentStatus;
import com.university.web.dto.department.DepartmentCreateRequestDTO;
import com.university.web.dto.department.DepartmentResponseDTO;
import com.university.web.dto.department.DepartmentUpdateRequestDTO;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@AllArgsConstructor
@RequestMapping("/api/department")
public class DepartmentController {
    private final DepartmentService departmentService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DepartmentResponseDTO> createDepartment(@Valid @RequestBody DepartmentCreateRequestDTO dto){
        DepartmentResponseDTO department = departmentService.createDepartment(dto);
        return ResponseEntity.ok(department);
    }
    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DepartmentResponseDTO> updateDepartment(@PathVariable Long id, @Valid @RequestBody DepartmentUpdateRequestDTO dto){
        DepartmentResponseDTO department = departmentService.updateDepartment(id,dto);
        return ResponseEntity.ok(department);
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<DepartmentResponseDTO>> getAllDepartments(){
        List<DepartmentResponseDTO> response = departmentService.getAllDepartments();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DepartmentResponseDTO> getDepartmentById(@PathVariable Long id) {
        DepartmentResponseDTO response = departmentService.getDepartmentById(id);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteDepartment(@PathVariable Long id){
        departmentService.deleteDepartment(id);
        return ResponseEntity.ok(Map.of("Mensaje","Departamento borrado correctamente"));
    }

    @GetMapping("/paginated")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR')")
    public ResponseEntity<Page<DepartmentResponseDTO>> getAllDepartmentsPageable(
            @PageableDefault(size = 10, sort = "departmentName", direction = Sort.Direction.ASC) Pageable pageable
    ) {
        Page<DepartmentResponseDTO> response = departmentService.getAllDepartmentsPageable(pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/code/{departmentCode}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DepartmentResponseDTO> getDepartmentByCode(@PathVariable String departmentCode) {
        DepartmentResponseDTO response = departmentService.getDepartmentByCode(departmentCode);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DepartmentResponseDTO>> getDepartmentsByStatus(@PathVariable DepartmentStatus status) {
        List<DepartmentResponseDTO> response = departmentService.getDepartmentsByStatus(status);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<DepartmentResponseDTO>> searchDepartmentsByName(@RequestParam String name) {
        List<DepartmentResponseDTO> response = departmentService.searchDepartmentsByName(name);
        return ResponseEntity.ok(response);
    }
}

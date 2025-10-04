package com.university.web.controller;

import com.university.application.service.StudentService;
import com.university.domain.model.enums.StudentStatus;
import com.university.web.dto.student.StudentCreateRequestDTO;
import com.university.web.dto.student.StudentResponseDTO;
import com.university.web.dto.student.StudentUpdateRequestDTO;
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
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {
    private final StudentService studentService;

    //Crear estudiante
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StudentResponseDTO> createStudent(@Valid @RequestBody StudentCreateRequestDTO dto) {
        StudentResponseDTO response = studentService.createStudent(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    //Obtener estudiante por ID (Admin - Mismo Estudiante)
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurityService.isStudentOwner(#id)")
    public ResponseEntity<StudentResponseDTO> getStudentById(@PathVariable Long id) {
        StudentResponseDTO response = studentService.getStudentById(id);
        return ResponseEntity.ok(response);
    }

    //Obtener todos los estudiantes
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<StudentResponseDTO>> getAllStudents() {
        List<StudentResponseDTO> response = studentService.getAllStudents();
        return ResponseEntity.ok(response);
    }

    //Obtener estudiantes paginados
    @GetMapping("/paginated")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<StudentResponseDTO>> getAllStudentsPageable(
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.ASC) Pageable pageable
    ) {
        Page<StudentResponseDTO> response = studentService.getAllStudentsPageable(pageable);
        return ResponseEntity.ok(response);
    }

    //Buscar estudiante por código(Admin o mismo estudiante)
    @GetMapping("/code/{studentCode}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurityService.isStudentOwnerByCode(#studentCode)")
    public ResponseEntity<StudentResponseDTO> getStudentByStudentCode(@PathVariable String studentCode) {
        StudentResponseDTO response = studentService.getStudentByStudentCode(studentCode);
        return ResponseEntity.ok(response);
    }

    //Buscar estudiante por user ID (Admin o mismo usuario)
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurityService.isOwner(#userId)")
    public ResponseEntity<StudentResponseDTO> getStudentByUserId(@PathVariable Long userId) {
        StudentResponseDTO response = studentService.getStudentByUserId(userId);
        return ResponseEntity.ok(response);
    }

    //Buscar estudiante por email
    @GetMapping("/email")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StudentResponseDTO> getStudentByUserEmail(
            @RequestParam String email
    ) {
        StudentResponseDTO response = studentService.getStudentByUserEmail(email);
        return ResponseEntity.ok(response);
    }

    //Buscar estudiantes por carrera
    @GetMapping("/career/{careerId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<StudentResponseDTO>> getStudentsByCareer(@PathVariable Long careerId) {
        List<StudentResponseDTO> response = studentService.getStudentsByCareer(careerId);
        return ResponseEntity.ok(response);
    }

    //Buscar estudiantes por status
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<StudentResponseDTO>> getStudentsByStatus(@PathVariable StudentStatus status) {
        List<StudentResponseDTO> response = studentService.getStudentsByStatus(status);
        return ResponseEntity.ok(response);
    }

    //Buscar estudiantes por semestre
    @GetMapping("/semester/{semester}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<StudentResponseDTO>> getStudentsBySemester(@PathVariable Integer semester) {
        List<StudentResponseDTO> response = studentService.getStudentsBySemester(semester);
        return ResponseEntity.ok(response);
    }

    //Buscar estudiantes con deuda
    @GetMapping("/with-debt")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<StudentResponseDTO>> getStudentsWithDebt() {
        List<StudentResponseDTO> response = studentService.getStudentsWithDebt();
        return ResponseEntity.ok(response);
    }

    //Actualizar estudiante
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurityService.isStudentOwner(#id)")
    public ResponseEntity<StudentResponseDTO> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody StudentUpdateRequestDTO dto
    ) {
        StudentResponseDTO response = studentService.updateStudent(id, dto);
        return ResponseEntity.ok(response);
    }

    //Eliminar estudiante
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok(Map.of("mensaje", "Estudiante puesto en inactivo correctamente"));
    }
}

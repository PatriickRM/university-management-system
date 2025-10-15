package com.university.web.controller;

import com.university.application.service.CourseService;
import com.university.domain.model.enums.CourseStatus;
import com.university.web.dto.course.CourseCreateRequestDTO;
import com.university.web.dto.course.CourseResponseDTO;
import com.university.web.dto.course.CourseUpdateRequestDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.http.HttpResponse;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {
    private final CourseService courseService;

    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CourseResponseDTO> createCourse(@Valid @RequestBody CourseCreateRequestDTO dto) {
        CourseResponseDTO responseDTO = courseService.createCourse(dto);
        return ResponseEntity.ok(responseDTO);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CourseResponseDTO> updateCourse(@Valid @RequestBody CourseUpdateRequestDTO dto, @PathVariable Long id) {
        CourseResponseDTO response = courseService.updateCourse(id, dto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteCourse(@PathVariable Long id){
        courseService.deleteCourse(id);
        return ResponseEntity.ok("Curso eliminado");
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<CourseResponseDTO>> getAllCourses(){
        List<CourseResponseDTO> response = courseService.getAllCourses();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CourseResponseDTO> getCourseById(@PathVariable Long id) {
        CourseResponseDTO response = courseService.getCourseById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/paginated")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<CourseResponseDTO>> getAllCoursesPageable(
            @PageableDefault(size = 10, sort = "courseName", direction = Sort.Direction.ASC) Pageable pageable
    ) {
        Page<CourseResponseDTO> response = courseService.getAllCoursesPageable(pageable);
        return ResponseEntity.ok(response);
    }

    // Buscar curso por código
    @GetMapping("/code/{courseCode}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CourseResponseDTO> getCourseByCourseCode(@PathVariable String courseCode) {
        CourseResponseDTO response = courseService.getCourseByCourseCode(courseCode);
        return ResponseEntity.ok(response);
    }

    // Buscar cursos por status
    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR')")
    public ResponseEntity<List<CourseResponseDTO>> getCoursesByStatus(@PathVariable CourseStatus status) {
        List<CourseResponseDTO> response = courseService.getCoursesByStatus(status);
        return ResponseEntity.ok(response);
    }

    // Buscar cursos por departamento
    @GetMapping("/department/{departmentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<CourseResponseDTO>> getCoursesByDepartment(@PathVariable Long departmentId) {
        List<CourseResponseDTO> response = courseService.getCoursesByDepartment(departmentId);
        return ResponseEntity.ok(response);
    }

    // Buscar cursos activos por departamento
    @GetMapping("/department/{departmentId}/active")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<CourseResponseDTO>> getActiveCoursesByDepartment(@PathVariable Long departmentId) {
        List<CourseResponseDTO> response = courseService.getActiveCoursesByDepartment(departmentId);
        return ResponseEntity.ok(response);
    }

    // Buscar cursos por nombre
    @GetMapping("/search")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<CourseResponseDTO>> getCoursesByName(@RequestParam String name) {
        List<CourseResponseDTO> response = courseService.getCoursesByName(name);
        return ResponseEntity.ok(response);
    }

    // Buscar cursos por créditos
    @GetMapping("/credits/{credits}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<CourseResponseDTO>> getCoursesByCredits(@PathVariable Integer credits) {
        List<CourseResponseDTO> response = courseService.getCoursesByCredits(credits);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CourseResponseDTO> activateCourse(@PathVariable Long id) {
        courseService.activateCourse(id);
        CourseResponseDTO response = courseService.getCourseById(id);
        return ResponseEntity.ok(response);
    }

    // Desactivar curso
    @PatchMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CourseResponseDTO> deactivateCourse(@PathVariable Long id) {
        courseService.deactivateCourse(id);
        CourseResponseDTO response = courseService.getCourseById(id);
        return ResponseEntity.ok(response);
    }
}
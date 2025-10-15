package com.university.application.validator;

import com.university.domain.model.Course;
import com.university.domain.repository.CourseRepository;
import com.university.domain.repository.DepartmentRepository;
import com.university.web.dto.course.CourseCreateRequestDTO;
import com.university.web.dto.course.CourseUpdateRequestDTO;
import com.university.application.exception.ErrorSistema;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CourseValidator {

    private final CourseRepository courseRepository;
    private final DepartmentRepository departmentRepository;

    public void validateCourseCreation(CourseCreateRequestDTO dto) {
        // Validar código único
        if (courseRepository.existsByCourseCode(dto.getCourseCode())) {
            throw new ErrorSistema("Código de curso ya existe: " + dto.getCourseCode());
        }

        // Validar que el departamento exista
        if (!departmentRepository.existsById(dto.getDepartmentId())) {
            throw new ErrorSistema("Departo con ID no encontrado: " + dto.getDepartmentId());
        }
    }

    public void validateCourseUpdate(Course course, CourseUpdateRequestDTO dto) {
        // Validar que el departamento exista si se está actualizando
        if (dto.getDepartmentId() != null && !departmentRepository.existsById(dto.getDepartmentId())) {
            throw new ErrorSistema("Departo con ID no encontrado: " + dto.getDepartmentId());
        }
    }
}
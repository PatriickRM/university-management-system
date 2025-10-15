package com.university.application.service.impl;

import com.university.application.exception.ErrorSistema;
import com.university.application.mapper.CourseMapper;
import com.university.application.service.CourseService;
import com.university.application.validator.CourseValidator;
import com.university.domain.model.Course;
import com.university.domain.model.Department;
import com.university.domain.model.enums.CourseStatus;
import com.university.domain.repository.CourseRepository;
import com.university.domain.repository.DepartmentRepository;
import com.university.web.dto.course.CourseCreateRequestDTO;
import com.university.web.dto.course.CourseResponseDTO;
import com.university.web.dto.course.CourseUpdateRequestDTO;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CourseServiceImpl implements CourseService {
    private final CourseMapper courseMapper;
    private final CourseRepository courseRepository;
    private final DepartmentRepository departmentRepository;
    private final CourseValidator courseValidator;

    @Override
    public CourseResponseDTO createCourse(CourseCreateRequestDTO dto) {
        courseValidator.validateCourseCreation(dto);

        Course course = courseMapper.toEntity(dto);
        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new ErrorSistema("Departo con id no encontrado"));
        course.setDepartment(department);
        Course savedCourse = courseRepository.save(course);
        return courseMapper.toResponseDto(savedCourse);
    }

    @Override
    public CourseResponseDTO getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ErrorSistema("Curso con id no encontrado"));
        return courseMapper.toResponseDto(course);
    }

    @Override
    public CourseResponseDTO updateCourse(Long id, CourseUpdateRequestDTO dto) {
        Course existingCourse = courseRepository.findById(id)
                .orElseThrow(() -> new ErrorSistema("ID Del curso no encontrada"));
        courseValidator.validateCourseUpdate(existingCourse,dto);
        courseMapper.updateEntity(existingCourse,dto);

        if (dto.getDepartmentId() != null) {
            Department department = departmentRepository.findById(dto.getDepartmentId())
                    .orElseThrow(() -> new ErrorSistema("Departamento con id no encontrado"));
            existingCourse.setDepartment(department);
        }

        Course updatedCourse = courseRepository.save(existingCourse);

        return courseMapper.toResponseDto(updatedCourse);
    }

    @Override
    public void deleteCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ErrorSistema("Id de Curso no encontrada"));

        if (course.getCourseOfferings() != null && !course.getCourseOfferings().isEmpty()) {
            throw new ErrorSistema("No se puede borrar cursos asociados!");
        }
        courseRepository.delete(course);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseResponseDTO> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(courseMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CourseResponseDTO> getAllCoursesPageable(Pageable pageable) {
        return courseRepository.findAll(pageable)
                .map(courseMapper::toResponseDto);
    }

    @Override
    @Transactional(readOnly = true)
    public CourseResponseDTO getCourseByCourseCode(String courseCode) {
        Course course = courseRepository.findByCourseCode(courseCode)
                .orElseThrow(() -> new ErrorSistema("Curso con código no encontrado: " + courseCode));

        return courseMapper.toResponseDto(course);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseResponseDTO> getCoursesByStatus(CourseStatus status) {
        return courseRepository.findByStatus(status).stream()
                .map(courseMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseResponseDTO> getCoursesByDepartment(Long departmentId) {
        return courseRepository.findByDepartmentId(departmentId).stream()
                .map(courseMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseResponseDTO> getActiveCoursesByDepartment(Long departmentId) {
        return courseRepository.findActiveByDepartment(departmentId).stream()
                .map(courseMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseResponseDTO> getCoursesByName(String courseName) {
        return courseRepository.findByCourseNameContainingIgnoreCase(courseName).stream()
                .map(courseMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseResponseDTO> getCoursesByCredits(Integer credits) {
        return courseRepository.findByCredits(credits).stream()
                .map(courseMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public void activateCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ErrorSistema("Curso con código no encontrado: " + id));

        course.setStatus(CourseStatus.ACTIVO);
        courseRepository.save(course);
    }

    @Override
    public void deactivateCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ErrorSistema("Curso con código no encontrado: " + id));

        course.setStatus(CourseStatus.INACTIVO);
        courseRepository.save(course);
    }
}
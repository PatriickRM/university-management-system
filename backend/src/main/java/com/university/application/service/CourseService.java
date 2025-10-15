package com.university.application.service;

import com.university.domain.model.enums.CourseStatus;
import com.university.web.dto.course.CourseCreateRequestDTO;
import com.university.web.dto.course.CourseResponseDTO;
import com.university.web.dto.course.CourseUpdateRequestDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CourseService {
    //CRUD
    CourseResponseDTO createCourse(CourseCreateRequestDTO dto);
    CourseResponseDTO getCourseById(Long id);
    CourseResponseDTO updateCourse(Long id, CourseUpdateRequestDTO dto);
    void deleteCourse(Long id);
    //Búsquedas
    List<CourseResponseDTO> getAllCourses();
    Page<CourseResponseDTO> getAllCoursesPageable(Pageable pageable);
    CourseResponseDTO getCourseByCourseCode(String courseCode);
    List<CourseResponseDTO> getCoursesByStatus(CourseStatus status);
    List<CourseResponseDTO> getCoursesByDepartment(Long departmentId);
    List<CourseResponseDTO> getActiveCoursesByDepartment(Long departmentId);
    List<CourseResponseDTO> getCoursesByName(String courseName);
    List<CourseResponseDTO> getCoursesByCredits(Integer credits);

    void deactivateCourse(Long id);
    void activateCourse(Long id);
}

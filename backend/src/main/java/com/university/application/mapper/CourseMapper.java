package com.university.application.mapper;

import com.university.domain.model.Course;
import com.university.web.dto.course.CourseCreateRequestDTO;
import com.university.web.dto.course.CourseResponseDTO;
import com.university.web.dto.course.CourseUpdateRequestDTO;

public interface CourseMapper {
    CourseResponseDTO toResponseDto(Course course);
    Course toEntity(CourseCreateRequestDTO dto);
    void updateEntity(Course course, CourseUpdateRequestDTO dto);
}

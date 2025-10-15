package com.university.application.mapper.impl;

import com.university.application.mapper.CourseMapper;
import com.university.domain.model.Course;
import com.university.domain.model.Department;
import com.university.domain.model.enums.CourseStatus;
import com.university.web.dto.course.CourseCreateRequestDTO;
import com.university.web.dto.course.CourseResponseDTO;
import com.university.web.dto.course.CourseUpdateRequestDTO;
import com.university.web.dto.department.DepartmentBasicDTO;
import org.springframework.stereotype.Component;

@Component
public class CourseMapperImpl implements CourseMapper {

    @Override
    public CourseResponseDTO toResponseDto(Course course) {
        return CourseResponseDTO.builder()
                .id(course.getId())
                .courseCode(course.getCourseCode())
                .courseName(course.getCourseName())
                .credits(course.getCredits())
                .description(course.getDescription())
                .status(course.getStatus())
                .department(toDepartmentBasicDTO(course.getDepartment()))
                .build();
    }

    @Override
    public Course toEntity(CourseCreateRequestDTO dto) {
        return Course.builder()
                .courseCode(dto.getCourseCode())
                .courseName(dto.getCourseName())
                .status(CourseStatus.ACTIVO)
                .credits(dto.getCredits())
                .description(dto.getDescription())
                .build();
    }

    @Override
    public void updateEntity(Course course, CourseUpdateRequestDTO dto) {
        if(dto.getCourseName() != null) course.setCourseName(dto.getCourseName());
        if(dto.getCredits() != null) course.setCredits(dto.getCredits());
        if(dto.getStatus() != null) course.setStatus(dto.getStatus());
        if(dto.getDescription() != null) course.setDescription(dto.getDescription());
    }

    private DepartmentBasicDTO toDepartmentBasicDTO(Department department) {
        return DepartmentBasicDTO.builder()
                .id(department.getId())
                .departmentCode(department.getDepartmentCode())
                .departmentName(department.getDepartmentName())
                .location(department.getLocation())
                .build();
    }
}

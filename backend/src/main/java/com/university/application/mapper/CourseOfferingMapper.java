package com.university.application.mapper;

import com.university.domain.model.CourseOffering;
import com.university.web.dto.courseoffering.CourseOfferingCreateRequestDTO;
import com.university.web.dto.courseoffering.CourseOfferingResponseDTO;
import com.university.web.dto.courseoffering.CourseOfferingUpdateRequestDTO;

public interface CourseOfferingMapper {
    CourseOffering toEntity(CourseOfferingCreateRequestDTO dto);
    void updateEntity(CourseOffering courseOffering, CourseOfferingUpdateRequestDTO dto);
    CourseOfferingResponseDTO toResponseDTO(CourseOffering courseOffering);
}
package com.university.application.mapper;

import com.university.domain.model.AcademicPeriod;
import com.university.web.dto.academicperiod.AcademicPeriodCreateRequestDTO;
import com.university.web.dto.academicperiod.AcademicPeriodResponseDTO;
import com.university.web.dto.academicperiod.AcademicPeriodUpdateRequestDTO;

public interface AcademicPeriodMapper {
    AcademicPeriod toEntity(AcademicPeriodCreateRequestDTO dto);
    void updateEntity(AcademicPeriod academicPeriod, AcademicPeriodUpdateRequestDTO dto);
    AcademicPeriodResponseDTO toResponseDTO(AcademicPeriod academicPeriod);
}

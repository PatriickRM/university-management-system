package com.university.application.mapper.impl;

import com.university.application.mapper.AcademicPeriodMapper;
import com.university.domain.model.AcademicPeriod;
import com.university.domain.model.enums.PeriodStatus;
import com.university.web.dto.academicperiod.AcademicPeriodCreateRequestDTO;
import com.university.web.dto.academicperiod.AcademicPeriodResponseDTO;
import com.university.web.dto.academicperiod.AcademicPeriodUpdateRequestDTO;
import org.springframework.stereotype.Component;

@Component
public class AcademicPeriodMapperImpl implements AcademicPeriodMapper {

    @Override
    public AcademicPeriod toEntity(AcademicPeriodCreateRequestDTO dto) {
        return AcademicPeriod.builder()
                .periodCode(dto.getPeriodCode())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .status(PeriodStatus.NO_INICIADO)
                .build();
    }

    @Override
    public void updateEntity(AcademicPeriod academicPeriod, AcademicPeriodUpdateRequestDTO dto) {
        if (dto.getStartDate() != null) academicPeriod.setStartDate(dto.getStartDate());
        if (dto.getEndDate() != null) academicPeriod.setEndDate(dto.getEndDate());
        if (dto.getStatus() != null) academicPeriod.setStatus(dto.getStatus());
    }

    @Override
    public AcademicPeriodResponseDTO toResponseDTO(AcademicPeriod academicPeriod) {
        return AcademicPeriodResponseDTO.builder()
                .id(academicPeriod.getId())
                .periodCode(academicPeriod.getPeriodCode())
                .startDate(academicPeriod.getStartDate())
                .endDate(academicPeriod.getEndDate())
                .status(academicPeriod.getStatus())
                .build();
    }
}

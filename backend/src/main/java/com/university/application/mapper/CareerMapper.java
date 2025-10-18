package com.university.application.mapper;

import com.university.domain.model.Career;
import com.university.web.dto.career.CareerCreateRequestDTO;
import com.university.web.dto.career.CareerResponseDTO;
import com.university.web.dto.career.CareerUpdateRequestDTO;

public interface CareerMapper {
    Career toEntity(CareerCreateRequestDTO dto);
    void updateEntity(Career career, CareerUpdateRequestDTO dto);
    CareerResponseDTO toResponseDTO(Career career);
}

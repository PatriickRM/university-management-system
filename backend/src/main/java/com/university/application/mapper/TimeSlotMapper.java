package com.university.application.mapper;

import com.university.domain.model.TimeSlot;
import com.university.web.dto.timeslot.TimeSlotCreateRequestDTO;
import com.university.web.dto.timeslot.TimeSlotResponseDTO;

public interface TimeSlotMapper {
    TimeSlot toEntity(TimeSlotCreateRequestDTO dto);
    TimeSlotResponseDTO toResponseDTO(TimeSlot timeSlot);
}

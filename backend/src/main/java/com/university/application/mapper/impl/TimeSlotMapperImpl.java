package com.university.application.mapper.impl;

import com.university.application.mapper.TimeSlotMapper;
import com.university.domain.model.TimeSlot;
import com.university.web.dto.timeslot.TimeSlotCreateRequestDTO;
import com.university.web.dto.timeslot.TimeSlotResponseDTO;
import org.springframework.stereotype.Component;

@Component
public class TimeSlotMapperImpl implements TimeSlotMapper {

    @Override
    public TimeSlot toEntity(TimeSlotCreateRequestDTO dto) {
        return TimeSlot.builder()
                .dayOfWeek(dto.getDayOfWeek())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .classroom(dto.getClassroom())
                .build();
    }

    @Override
    public TimeSlotResponseDTO toResponseDTO(TimeSlot timeSlot) {
        return TimeSlotResponseDTO.builder()
                .id(timeSlot.getId())
                .dayOfWeek(timeSlot.getDayOfWeek())
                .startTime(timeSlot.getStartTime())
                .endTime(timeSlot.getEndTime())
                .classroom(timeSlot.getClassroom())
                .durationHours(timeSlot.getDurationHours())
                .build();
    }
}

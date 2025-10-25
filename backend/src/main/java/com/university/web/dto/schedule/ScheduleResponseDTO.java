package com.university.web.dto.schedule;

import com.university.web.dto.timeslot.TimeSlotResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleResponseDTO {
    private Long courseOfferingId;
    private String courseCode;
    private String courseName;
    private String professorName;
    private Integer credits;
    private List<TimeSlotResponseDTO> timeSlots;
    private Double totalWeeklyHours;
}

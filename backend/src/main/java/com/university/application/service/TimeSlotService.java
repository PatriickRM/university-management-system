package com.university.application.service;

import com.university.web.dto.schedule.ScheduleResponseDTO;
import com.university.web.dto.timeslot.TimeSlotResponseDTO;

import java.util.List;

public interface TimeSlotService {
    List<TimeSlotResponseDTO> getTimeSlotsByCourseOffering(Long courseOfferingId);
    List<ScheduleResponseDTO> getStudentSchedule(Long studentId, Long periodId);
    List<ScheduleResponseDTO> getProfessorSchedule(Long professorId, Long periodId);
    void deleteTimeSlot(Long timeSlotId);
}

package com.university.application.service.impl;

import com.university.application.exception.ErrorSistema;
import com.university.application.mapper.TimeSlotMapper;
import com.university.application.service.TimeSlotService;
import com.university.domain.model.TimeSlot;
import com.university.domain.repository.TimeSlotRepository;
import com.university.web.dto.schedule.ScheduleResponseDTO;
import com.university.web.dto.timeslot.TimeSlotResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TimeSlotServiceImpl implements TimeSlotService {

    private final TimeSlotRepository timeSlotRepository;
    private final TimeSlotMapper timeSlotMapper;

    @Override
    @Transactional(readOnly = true)
    public List<TimeSlotResponseDTO> getTimeSlotsByCourseOffering(Long courseOfferingId) {
        return timeSlotRepository.findByCourseOfferingId(courseOfferingId).stream()
                .map(timeSlotMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ScheduleResponseDTO> getStudentSchedule(Long studentId, Long periodId) {
        List<TimeSlot> timeSlots = timeSlotRepository.findStudentSchedule(studentId, periodId);
        return groupTimeSlotsByCourseOffering(timeSlots);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ScheduleResponseDTO> getProfessorSchedule(Long professorId, Long periodId) {
        List<TimeSlot> timeSlots = timeSlotRepository.findProfessorSchedule(professorId, periodId);
        return groupTimeSlotsByCourseOffering(timeSlots);
    }

    @Override
    public void deleteTimeSlot(Long timeSlotId) {
        TimeSlot timeSlot = timeSlotRepository.findById(timeSlotId)
                .orElseThrow(() -> new ErrorSistema("Franja horaria con ID no encontrada: " + timeSlotId));

        timeSlotRepository.delete(timeSlot);
    }

    private List<ScheduleResponseDTO> groupTimeSlotsByCourseOffering(List<TimeSlot> timeSlots) {
        Map<Long, List<TimeSlot>> grouped = timeSlots.stream()
                .collect(Collectors.groupingBy(ts -> ts.getCourseOffering().getId()));

        return grouped.values().stream()
                .map(slots -> {
                    TimeSlot firstSlot = slots.getFirst();
                    var offering = firstSlot.getCourseOffering();
                    var professor = offering.getProfessor();

                    String professorName = professor.getUser().getFirstName() + " " +
                            professor.getUser().getLastName();

                    return ScheduleResponseDTO.builder()
                            .courseOfferingId(offering.getId())
                            .courseCode(offering.getCourse().getCourseCode())
                            .courseName(offering.getCourse().getCourseName())
                            .professorName(professorName)
                            .credits(offering.getCourse().getCredits())
                            .timeSlots(slots.stream()
                                    .map(timeSlotMapper::toResponseDTO)
                                    .collect(Collectors.toList()))
                            .totalWeeklyHours(offering.getTotalWeeklyHours())
                            .build();
                })
                .collect(Collectors.toList());
    }
}

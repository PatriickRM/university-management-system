package com.university.web.dto.courseoffering;

import com.university.web.dto.timeslot.TimeSlotCreateRequestDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseOfferingCreateRequestDTO {
    @NotNull(message = "Course ID is required")
    private Long courseId;

    @NotNull(message = "Academic period ID is required")
    private Long academicPeriodId;

    @NotNull(message = "Professor ID is required")
    private Long professorId;

    @NotNull(message = "Max students is required")
    @Min(value = 1, message = "Max students must be at least 1")
    private Integer maxStudents;

    @Min(value = 1, message = "Duration must be at least 1 week")
    private Integer durationWeeks = 15;

    //Franja Horaria
    @Valid
    @Size(min = 1, message = "At least one time slot is required")
    @Size(max = 4, message = "Maximum 4 time slots per course")
    @Builder.Default
    private List<TimeSlotCreateRequestDTO> timeSlots = new ArrayList<>();

}

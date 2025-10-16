package com.university.web.dto.courseoffering;

import com.university.domain.model.enums.OfferingStatus;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseOfferingUpdateRequestDTO {
    private Long professorId;
    @Min(value = 1, message = "Max students must be at least 1")
    private Integer maxStudents;
    private OfferingStatus status;
}

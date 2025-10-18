package com.university.web.dto.career;

import com.university.domain.model.enums.CareerStatus;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CareerUpdateRequestDTO {
    private String careerName;
    private String description;
    @Min(value = 1, message = "Duration must be at least 1 semester")
    private Integer durationSemesters;
    private Long departmentId;
    private CareerStatus status;
}
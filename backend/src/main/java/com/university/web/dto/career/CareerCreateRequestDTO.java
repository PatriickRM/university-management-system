package com.university.web.dto.career;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CareerCreateRequestDTO {
    @NotBlank(message = "Career code is required")
    private String careerCode;
    @NotBlank(message = "Career name is required")
    private String careerName;
    private String description;

    @NotNull(message = "Duration in semesters is required")
    @Min(value = 1, message = "Duration must be at least 1 semester")
    private Integer durationSemesters;

    @NotNull(message = "Department ID is required")
    private Long departmentId;
}

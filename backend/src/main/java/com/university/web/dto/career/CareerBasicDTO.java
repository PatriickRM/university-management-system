package com.university.web.dto.career;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CareerBasicDTO {
    private Long id;
    private String careerCode;
    private String careerName;
    private Integer durationSemesters;
}
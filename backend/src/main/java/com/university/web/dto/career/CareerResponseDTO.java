package com.university.web.dto.career;

import com.university.domain.model.enums.CareerStatus;
import com.university.web.dto.department.DepartmentBasicDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CareerResponseDTO {
    private Long id;
    private String careerCode;
    private String careerName;
    private String description;
    private Integer durationSemesters;
    private CareerStatus status;
    private DepartmentBasicDTO department;
}
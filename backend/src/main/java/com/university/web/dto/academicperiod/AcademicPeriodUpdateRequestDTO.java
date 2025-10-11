package com.university.web.dto.academicperiod;

import com.university.domain.model.enums.PeriodStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AcademicPeriodUpdateRequestDTO {
    private LocalDate startDate;
    private LocalDate endDate;
    private PeriodStatus status;
}

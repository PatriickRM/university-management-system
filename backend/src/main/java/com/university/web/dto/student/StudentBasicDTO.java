package com.university.web.dto.student;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentBasicDTO {
    private Long id;
    private String studentCode;
    private String fullName;
    private Integer currentSemester;
}
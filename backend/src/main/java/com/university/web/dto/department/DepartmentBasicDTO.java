package com.university.web.dto.department;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentBasicDTO {
    private Long id;
    private String departmentCode;
    private String departmentName;
    private String location;
}

package com.university.web.dto.department;

import com.university.domain.model.enums.DepartmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentResponseDTO {
    private Long id;
    private String departmentCode;
    private String departmentName;
    private String description;
    private String location;
    private String phone;
    private DepartmentStatus status;
}
package com.university.web.dto.department;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentCreateRequestDTO {
    @NotBlank(message = "Department code is required")
    private String departmentCode;
    @NotBlank(message = "Department name is required")
    private String departmentName;
    private String description;
    private String location;
    private String phone;
}
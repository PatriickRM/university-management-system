package com.university.application.mapper;

import com.university.domain.model.Student;
import com.university.web.dto.student.StudentCreateRequestDTO;
import com.university.web.dto.student.StudentResponseDTO;
import com.university.web.dto.student.StudentUpdateRequestDTO;

public interface StudentMapper {
    Student toEntity(StudentCreateRequestDTO dto);
    void updateEntity(Student student, StudentUpdateRequestDTO dto);
    StudentResponseDTO toResponseDTO(Student student);
}

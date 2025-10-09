package com.university.application.mapper;

import com.university.domain.model.Professor;
import com.university.web.dto.professor.ProfessorCreateRequestDTO;
import com.university.web.dto.professor.ProfessorResponseDTO;
import com.university.web.dto.professor.ProfessorUpdateRequestDTO;

public interface ProfessorMapper {
    Professor toEntity(ProfessorCreateRequestDTO dto);
    void updateEntity(Professor professor, ProfessorUpdateRequestDTO dto);
    ProfessorResponseDTO toResponseDTO(Professor professor);
}

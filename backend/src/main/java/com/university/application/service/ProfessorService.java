package com.university.application.service;

import com.university.domain.model.enums.EmploymentType;
import com.university.domain.model.enums.ProfessorStatus;
import com.university.web.dto.professor.ProfessorCreateRequestDTO;
import com.university.web.dto.professor.ProfessorResponseDTO;
import com.university.web.dto.professor.ProfessorUpdateRequestDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProfessorService {
    // CRUD
    ProfessorResponseDTO createProfessor(ProfessorCreateRequestDTO dto);
    ProfessorResponseDTO getProfessorById(Long id);
    ProfessorResponseDTO updateProfessor(Long id, ProfessorUpdateRequestDTO dto);
    void deleteProfessor(Long id);

    // Búsquedas
    List<ProfessorResponseDTO> getAllProfessors();
    Page<ProfessorResponseDTO> getAllProfessorsPageable(Pageable pageable);
    ProfessorResponseDTO getProfessorByEmployeeCode(String employeeCode);
    ProfessorResponseDTO getProfessorByUserId(Long userId);
    ProfessorResponseDTO getProfessorByUserEmail(String email);

    // Búsquedas filtradas
    List<ProfessorResponseDTO> getProfessorsByDepartment(Long departmentId);
    List<ProfessorResponseDTO> getProfessorsByStatus(ProfessorStatus status);
    List<ProfessorResponseDTO> getProfessorsByEmploymentType(EmploymentType employmentType);
    List<ProfessorResponseDTO> getProfessorsBySpecialization(String specialization);
}
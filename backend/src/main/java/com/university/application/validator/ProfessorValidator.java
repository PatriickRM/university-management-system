package com.university.application.validator;

import com.university.application.exception.ErrorSistema;
import com.university.domain.model.Professor;
import com.university.domain.repository.DepartmentRepository;
import com.university.domain.repository.ProfessorRepository;
import com.university.domain.repository.UserRepository;
import com.university.web.dto.professor.ProfessorCreateRequestDTO;
import com.university.web.dto.professor.ProfessorUpdateRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ProfessorValidator {

    private final ProfessorRepository professorRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;

    public void validateProfessorCreation(ProfessorCreateRequestDTO dto) {
        // Validar código de empleado único
        if (professorRepository.existsByEmployeeCode(dto.getEmployeeCode())) {
            throw new ErrorSistema("Employee code already exists: " + dto.getEmployeeCode());
        }

        // Validar que el email del usuario no exista
        if (userRepository.existsByEmail(dto.getUserInfo().getEmail())) {
            throw new ErrorSistema("Email already exists: " + dto.getUserInfo().getEmail());
        }

        // Validar que el username no exista
        if (userRepository.existsByUsername(dto.getUserInfo().getUsername())) {
            throw new ErrorSistema("Username already exists: " + dto.getUserInfo().getUsername());
        }

        // Validar que el departamento exista
        if (!departmentRepository.existsById(dto.getDepartmentId())) {
            throw new ErrorSistema("Department not found with ID: " + dto.getDepartmentId());
        }
    }

    public void validateProfessorUpdate(Professor professor, ProfessorUpdateRequestDTO dto) {
        // Validar que el departamento exista si se está actualizando
        if (dto.getDepartmentId() != null && !departmentRepository.existsById(dto.getDepartmentId())) {
            throw new ErrorSistema("Department not found with ID: " + dto.getDepartmentId());
        }
    }
}
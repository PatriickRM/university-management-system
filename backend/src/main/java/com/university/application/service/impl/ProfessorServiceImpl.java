package com.university.application.service.impl;

import com.university.application.exception.ErrorSistema;
import com.university.application.mapper.ProfessorMapper;
import com.university.application.mapper.UserMapper;
import com.university.application.service.ProfessorService;
import com.university.application.validator.ProfessorValidator;
import com.university.domain.model.Department;
import com.university.domain.model.Professor;
import com.university.domain.model.Role;
import com.university.domain.model.User;
import com.university.domain.model.enums.EmploymentType;
import com.university.domain.model.enums.ProfessorStatus;
import com.university.domain.repository.DepartmentRepository;
import com.university.domain.repository.ProfessorRepository;
import com.university.domain.repository.RoleRepository;
import com.university.domain.repository.UserRepository;
import com.university.web.dto.professor.ProfessorCreateRequestDTO;
import com.university.web.dto.professor.ProfessorResponseDTO;
import com.university.web.dto.professor.ProfessorUpdateRequestDTO;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional
public class ProfessorServiceImpl implements ProfessorService {
    private ProfessorRepository professorRepository;
    private UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final RoleRepository roleRepository;
    private final ProfessorMapper professorMapper;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final ProfessorValidator professorValidator;

    @Override
    public ProfessorResponseDTO createProfessor(ProfessorCreateRequestDTO dto) {
        //Validaciones
        professorValidator.validateProfessorCreation(dto);
        //Crear
        User user = userMapper.toEntity(dto.getUserInfo());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        //Asignar rol
        Role professorRole = roleRepository.findByName("PROFESSOR")
                .orElseThrow(() -> new ErrorSistema("Rol PROFESSOR no encontrado"));
        user.setRoles(Set.of(professorRole));

        User savedUser = userRepository.save(user);
        //Crear profesor
        Professor professor = professorMapper.toEntity(dto);
        professor.setUser(savedUser);

        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new ErrorSistema("Department not found with ID: " + dto.getDepartmentId()));
        professor.setDepartment(department);

        Professor savedProfessor = professorRepository.save(professor);

        return professorMapper.toResponseDTO(savedProfessor);

    }

    @Override
    @Transactional(readOnly = true)
    public ProfessorResponseDTO getProfessorById(Long id) {
        Professor professor = professorRepository.findByUserId(id)
                .orElseThrow(() -> new ErrorSistema("ID de profesor no encontrada"));

        return professorMapper.toResponseDTO(professor);
    }

    @Override
    public ProfessorResponseDTO updateProfessor(Long id, ProfessorUpdateRequestDTO dto) {
        Professor existingProfessor = professorRepository.findById(id)
                .orElseThrow(() -> new ErrorSistema("Professor not found with ID: " + id));

        professorValidator.validateProfessorUpdate(existingProfessor, dto);

        // Actualizar datos del profesor
        professorMapper.updateEntity(existingProfessor, dto);

        // Actualizar departamento si viene en el DTO
        if (dto.getDepartmentId() != null) {
            Department department = departmentRepository.findById(dto.getDepartmentId())
                    .orElseThrow(() -> new ErrorSistema("Department not found with ID: " + dto.getDepartmentId()));
            existingProfessor.setDepartment(department);
        }

        Professor updatedProfessor = professorRepository.save(existingProfessor);

        return professorMapper.toResponseDTO(updatedProfessor);

    }

    @Override
    public void deleteProfessor(Long id) {
        Professor professor = professorRepository.findById(id)
                .orElseThrow(() -> new ErrorSistema("Professor not found with ID: " + id));

        // Soft delete - cambiar status a INACTIVE
        professor.setStatus(ProfessorStatus.INACTIVO);
        professorRepository.save(professor);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProfessorResponseDTO> getAllProfessors() {
        return professorRepository.findAll().stream()
                .map(professorMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProfessorResponseDTO> getAllProfessorsPageable(Pageable pageable) {
        return professorRepository.findAll(pageable)
                .map(professorMapper::toResponseDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public ProfessorResponseDTO getProfessorByEmployeeCode(String employeeCode) {
        Professor professor = professorRepository.findByEmployeeCode(employeeCode)
                .orElseThrow(() -> new ErrorSistema("Cod Empleado no encontrado"));
        return professorMapper.toResponseDTO(professor);
    }

    @Override
    @Transactional(readOnly = true)
    public ProfessorResponseDTO getProfessorByUserId(Long userId) {
        Professor professor = professorRepository.findByUserId(userId)
                .orElseThrow(() -> new ErrorSistema("User ID No encontrado"));
        return professorMapper.toResponseDTO(professor);
    }

    @Override
    @Transactional(readOnly = true)
    public ProfessorResponseDTO getProfessorByUserEmail(String email) {
        Professor professor = professorRepository.findByUserEmail(email)
                .orElseThrow(() -> new ErrorSistema("Email de Profesor no encontrado"));
        return professorMapper.toResponseDTO(professor);
    }

    @Override
    public List<ProfessorResponseDTO> getProfessorsByDepartment(Long departmentId) {
        return professorRepository.findByDepartmentId(departmentId).stream()
                .map(professorMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProfessorResponseDTO> getProfessorsByStatus(ProfessorStatus status) {
        return professorRepository.findByStatus(status).stream()
                .map(professorMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProfessorResponseDTO> getProfessorsByEmploymentType(EmploymentType employmentType) {
        return professorRepository.findByEmploymentType(employmentType).stream()
                .map(professorMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProfessorResponseDTO> getProfessorsBySpecialization(String specialization) {
        return professorRepository.findBySpecializationContainingIgnoreCase(specialization).stream()
                .map(professorMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}

package com.university.application.service.impl;

import com.university.application.exception.ErrorSistema;
import com.university.application.mapper.DepartmentMapper;
import com.university.application.service.DepartmentService;
import com.university.domain.model.Department;
import com.university.domain.model.enums.DepartmentStatus;
import com.university.domain.repository.DepartmentRepository;
import com.university.web.dto.department.DepartmentCreateRequestDTO;
import com.university.web.dto.department.DepartmentResponseDTO;
import com.university.web.dto.department.DepartmentUpdateRequestDTO;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional
public class DepartmentServiceImpl implements DepartmentService {
    private final DepartmentMapper departmentMapper;
    private final DepartmentRepository departmentRepository;

    @Override
    public DepartmentResponseDTO createDepartment(DepartmentCreateRequestDTO dto) {
        if (departmentRepository.existsByDepartmentCode(dto.getDepartmentCode())) {throw new ErrorSistema("Codigo de Departamento ya existente: " + dto.getDepartmentCode());}
        Department department = departmentMapper.toEntity(dto);
        Department savedDepartment = departmentRepository.save(department);
        return departmentMapper.toResponseDto(savedDepartment);
    }

    @Override
    public DepartmentResponseDTO getDepartmentById(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ErrorSistema("Departamento con id no encontrado"));
        return departmentMapper.toResponseDto(department);
    }

    @Override
    public DepartmentResponseDTO updateDepartment(Long id, DepartmentUpdateRequestDTO dto) {
        Department existDepartment = departmentRepository.findById(id)
                .orElseThrow(() -> new ErrorSistema("Departmento con id no encontrada"));
        departmentMapper.updateEntity(dto,existDepartment);

        Department updatedDepartment = departmentRepository.save(existDepartment);
        return departmentMapper.toResponseDto(updatedDepartment);
    }

    @Override
    public void deleteDepartment(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ErrorSistema("Departmento con id no encontrada"));

        if ((department.getCareers() != null && !department.getCareers().isEmpty()) ||
                (department.getProfessors() != null && !department.getProfessors().isEmpty())) {
            throw new ErrorSistema("No se puede borrar departamento con profesores o carreras asociadas");
        }

        departmentRepository.delete(department);

    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentResponseDTO> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(departmentMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DepartmentResponseDTO> getAllDepartmentsPageable(Pageable pageable) {
        return departmentRepository.findAll(pageable).map(departmentMapper::toResponseDto);
    }

    @Override
    @Transactional(readOnly = true)
    public DepartmentResponseDTO getDepartmentByCode(String departmentCode) {
        Department department = departmentRepository.findByDepartmentCode(departmentCode)
                .orElseThrow(() -> new ErrorSistema("Codigo de departamento no encontrado"));
        return departmentMapper.toResponseDto(department);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentResponseDTO> getDepartmentsByStatus(DepartmentStatus status) {
        return departmentRepository.findByStatus(status).stream()
                .map(departmentMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<DepartmentResponseDTO> searchDepartmentsByName(String name) {
        return departmentRepository.findByDepartmentNameContainingIgnoreCase(name)
                .stream().map(departmentMapper::toResponseDto)
                .collect(Collectors.toList());
    }
}

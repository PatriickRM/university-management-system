package com.university.application.service.impl;

import com.university.application.exception.ErrorSistema;
import com.university.application.mapper.CareerMapper;
import com.university.application.service.CareerService;
import com.university.domain.model.Career;
import com.university.domain.model.Department;
import com.university.domain.model.enums.CareerStatus;
import com.university.domain.repository.CareerRepository;
import com.university.domain.repository.DepartmentRepository;
import com.university.web.dto.career.CareerCreateRequestDTO;
import com.university.web.dto.career.CareerResponseDTO;
import com.university.web.dto.career.CareerUpdateRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CareerServiceImpl implements CareerService {

    private final CareerRepository careerRepository;
    private final DepartmentRepository departmentRepository;
    private final CareerMapper careerMapper;

    @Override
    public CareerResponseDTO createCareer(CareerCreateRequestDTO dto) {
        if (careerRepository.existsByCareerCode(dto.getCareerCode())) {
            throw new ErrorSistema("Codigo de carrera ya existente: " + dto.getCareerCode());
        }
        Career career = careerMapper.toEntity(dto);

        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new ErrorSistema("Departamento con id no encontrado: " + dto.getDepartmentId()));
        career.setDepartment(department);

        Career savedCareer = careerRepository.save(career);

        return careerMapper.toResponseDTO(savedCareer);
    }

    @Override
    @Transactional(readOnly = true)
    public CareerResponseDTO getCareerById(Long id) {
        Career career = careerRepository.findById(id)
                .orElseThrow(() -> new ErrorSistema("Carrera con id no encontrada: " + id));

        return careerMapper.toResponseDTO(career);
    }

    @Override
    public CareerResponseDTO updateCareer(Long id, CareerUpdateRequestDTO dto) {
        
        Career existingCareer = careerRepository.findById(id)
                .orElseThrow(() -> new ErrorSistema("Carrera con id no encontrada: " + id));

        careerMapper.updateEntity(existingCareer, dto);
        
        if (dto.getDepartmentId() != null) {
            Department department = departmentRepository.findById(dto.getDepartmentId())
                    .orElseThrow(() -> new ErrorSistema("Departamento con id no encontrado: " + dto.getDepartmentId()));
            existingCareer.setDepartment(department);
        }
        Career updatedCareer = careerRepository.save(existingCareer);
        return careerMapper.toResponseDTO(updatedCareer);
    }

    @Override
    public void deleteCareer(Long id) {
        Career career = careerRepository.findById(id)
                .orElseThrow(() -> new ErrorSistema("Carrera con id no encontrada: " + id));
        careerRepository.delete(career);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CareerResponseDTO> getAllCareers() {
        return careerRepository.findAll().stream()
                .map(careerMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CareerResponseDTO> getAllCareersPageable(Pageable pageable) {
        return careerRepository.findAll(pageable)
                .map(careerMapper::toResponseDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public CareerResponseDTO getCareerByCode(String careerCode) {
        Career career = careerRepository.findByCareerCode(careerCode)
                .orElseThrow(() -> new ErrorSistema("Carrera con codigo no encontrada: " + careerCode));

        return careerMapper.toResponseDTO(career);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CareerResponseDTO> getCareersByStatus(CareerStatus status) {
        return careerRepository.findByStatus(status).stream()
                .map(careerMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CareerResponseDTO> getCareersByDepartment(Long departmentId) {
        return careerRepository.findByDepartmentId(departmentId).stream()
                .map(careerMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CareerResponseDTO> getActiveCareersByDepartment(Long departmentId) {
        return careerRepository.findActiveByDepartment(departmentId).stream()
                .map(careerMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CareerResponseDTO> searchCareersByName(String name) {
        return careerRepository.findByCareerNameContainingIgnoreCase(name).stream()
                .map(careerMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}

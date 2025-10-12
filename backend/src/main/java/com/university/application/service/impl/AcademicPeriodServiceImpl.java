package com.university.application.service.impl;

import com.university.application.exception.ErrorSistema;
import com.university.application.mapper.AcademicPeriodMapper;
import com.university.application.service.AcademicPeriodService;
import com.university.application.validator.AcademicPeriodValidator;
import com.university.domain.model.AcademicPeriod;
import com.university.domain.model.enums.PeriodStatus;
import com.university.domain.repository.AcademicPeriodRepository;
import com.university.web.dto.academicperiod.AcademicPeriodCreateRequestDTO;
import com.university.web.dto.academicperiod.AcademicPeriodResponseDTO;
import com.university.web.dto.academicperiod.AcademicPeriodUpdateRequestDTO;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional
public class AcademicPeriodServiceImpl implements AcademicPeriodService {
    private final AcademicPeriodRepository academicPeriodRepository;
    private final AcademicPeriodMapper academicPeriodMapper;
    private final AcademicPeriodValidator academicPeriodValidator;

    @Override
    public AcademicPeriodResponseDTO createAcademicPeriod(AcademicPeriodCreateRequestDTO dto) {
        academicPeriodValidator.validateAcademicPeriodCreation(dto);
        AcademicPeriod academicPeriod = academicPeriodMapper.toEntity(dto);
        AcademicPeriod savedPeriod = academicPeriodRepository.save(academicPeriod);

        return academicPeriodMapper.toResponseDTO(savedPeriod);
    }

    @Override
    @Transactional(readOnly = true)
    public AcademicPeriodResponseDTO getAcademicPeriodById(Long id) {
        AcademicPeriod academicPeriod = academicPeriodRepository.findById(id)
                .orElseThrow(() ->  new ErrorSistema("ID de periodo no existente"));
        return academicPeriodMapper.toResponseDTO(academicPeriod);
    }

    @Override
    public AcademicPeriodResponseDTO updateAcademicPeriod(Long id, AcademicPeriodUpdateRequestDTO dto) {
        AcademicPeriod existingPeriod = academicPeriodRepository.findById(id)
                .orElseThrow(() ->  new ErrorSistema("ID de periodo no existente"));
        academicPeriodValidator.validateAcademicPeriodUpdate(existingPeriod,dto);

        academicPeriodMapper.updateEntity(existingPeriod,dto);
        AcademicPeriod updatedPeriod = academicPeriodRepository.save(existingPeriod);

        return academicPeriodMapper.toResponseDTO(updatedPeriod);
    }

    @Override
    public void deleteAcademicPeriod(Long id) {
        AcademicPeriod existingPeriod = academicPeriodRepository.findById(id)
                .orElseThrow(() ->  new ErrorSistema("ID de periodo no existente"));
        // Verificar que no tenga course offerings asociados
        if (existingPeriod.getCourseOfferings() != null && !existingPeriod.getCourseOfferings().isEmpty()) {
            throw new ErrorSistema("No se puede borrar periodo académico con cursos asignados");
        }
        academicPeriodRepository.delete(existingPeriod);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AcademicPeriodResponseDTO> getAllAcademicPeriods() {
        return academicPeriodRepository.findAll().stream()
                .map(academicPeriodMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AcademicPeriodResponseDTO> getAllAcademicPeriodsPageable(Pageable pageable) {
        return academicPeriodRepository.findAll(pageable)
                .map(academicPeriodMapper::toResponseDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public AcademicPeriodResponseDTO getAcademicPeriodByCode(String periodCode) {
        AcademicPeriod academicPeriod = academicPeriodRepository.findByPeriodCode(periodCode)
                .orElseThrow(() -> new ErrorSistema("Codigo de periodo no existente"));

        return academicPeriodMapper.toResponseDTO(academicPeriod);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AcademicPeriodResponseDTO> getAcademicPeriodsByStatus(PeriodStatus status) {
        return academicPeriodRepository.findByStatus(status).stream()
                .map(academicPeriodMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AcademicPeriodResponseDTO> getAcademicPeriodsByYear(String year) {
        return academicPeriodRepository.findByYear(year).stream()
                .map(academicPeriodMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AcademicPeriodResponseDTO getActivePeriod() {
        AcademicPeriod activePeriod = academicPeriodRepository.findActivePeriod()
                .orElseThrow(() -> new ErrorSistema("No existen periodos activos"));

        return academicPeriodMapper.toResponseDTO(activePeriod);
    }

    @Override
    @Transactional(readOnly = true)
    public AcademicPeriodResponseDTO getPeriodByDate(LocalDate date) {
        AcademicPeriod period = academicPeriodRepository.findByDate(date)
                .orElseThrow(() -> new ErrorSistema("No hay periodos activos durante esa fecha"));

        return academicPeriodMapper.toResponseDTO(period);
    }
}

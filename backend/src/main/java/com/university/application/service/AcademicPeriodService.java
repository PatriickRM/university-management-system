package com.university.application.service;

import com.university.domain.model.enums.PeriodStatus;
import com.university.web.dto.academicperiod.AcademicPeriodCreateRequestDTO;
import com.university.web.dto.academicperiod.AcademicPeriodResponseDTO;
import com.university.web.dto.academicperiod.AcademicPeriodUpdateRequestDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface AcademicPeriodService {
    // CRUD básico
    AcademicPeriodResponseDTO createAcademicPeriod(AcademicPeriodCreateRequestDTO dto);
    AcademicPeriodResponseDTO getAcademicPeriodById(Long id);
    AcademicPeriodResponseDTO updateAcademicPeriod(Long id, AcademicPeriodUpdateRequestDTO dto);
    void deleteAcademicPeriod(Long id);

    // Búsquedas
    List<AcademicPeriodResponseDTO> getAllAcademicPeriods();
    Page<AcademicPeriodResponseDTO> getAllAcademicPeriodsPageable(Pageable pageable);
    AcademicPeriodResponseDTO getAcademicPeriodByCode(String periodCode);
    List<AcademicPeriodResponseDTO> getAcademicPeriodsByStatus(PeriodStatus status);
    List<AcademicPeriodResponseDTO> getAcademicPeriodsByYear(String year);
    AcademicPeriodResponseDTO getActivePeriod();
    AcademicPeriodResponseDTO getPeriodByDate(LocalDate date);
}

package com.university.application.validator;
import com.university.application.exception.ErrorSistema;
import com.university.domain.model.AcademicPeriod;
import com.university.domain.repository.AcademicPeriodRepository;
import com.university.web.dto.academicperiod.AcademicPeriodCreateRequestDTO;
import com.university.web.dto.academicperiod.AcademicPeriodUpdateRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class AcademicPeriodValidator {

    private final AcademicPeriodRepository academicPeriodRepository;

    public void validateAcademicPeriodCreation(AcademicPeriodCreateRequestDTO dto) {
        // Validar código único
        if (academicPeriodRepository.existsByPeriodCode(dto.getPeriodCode())) {
            throw new ErrorSistema("Codigo de periodo ya existente: " + dto.getPeriodCode());
        }
        // Validar que la fecha de fin sea posterior a la de inicio
        if (dto.getEndDate().isBefore(dto.getStartDate()) || dto.getEndDate().isEqual(dto.getStartDate())) {
            throw new ErrorSistema("La fecha de fin debe ser despues de la fecha de inicio");
        }
        // Validar que las fechas no sean en el pasado
        if (dto.getStartDate().isBefore(LocalDate.now())) {
            throw new ErrorSistema("La fecha de inicio no puede estar en pasado");
        }
    }

    public void validateAcademicPeriodUpdate(AcademicPeriod academicPeriod, AcademicPeriodUpdateRequestDTO dto) {
        // Validar que la fecha de fin sea posterior a la de inicio
        LocalDate startDate = dto.getStartDate() != null ? dto.getStartDate() : academicPeriod.getStartDate();
        LocalDate endDate = dto.getEndDate() != null ? dto.getEndDate() : academicPeriod.getEndDate();

        if (endDate.isBefore(startDate) || endDate.isEqual(startDate)) {
            throw new ErrorSistema("La fecha de fin debe ser despues de la fecha de inicio");
        }
    }
}

package com.university.domain.repository;

import com.university.domain.model.AcademicPeriod;
import com.university.domain.model.enums.PeriodStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AcademicPeriodRepository extends JpaRepository<AcademicPeriod, Long> {
    Optional<AcademicPeriod> findByPeriodCode(String periodCode);
    boolean existsByPeriodCode(String periodCode);
    List<AcademicPeriod> findByStatus(PeriodStatus status);
    // Obtener el período activo actual
    @Query("SELECT ap FROM AcademicPeriod ap WHERE ap.status = 'ACTIVE'")
    Optional<AcademicPeriod> findActivePeriod();
    // Buscar períodos por año
    @Query("SELECT ap FROM AcademicPeriod ap WHERE ap.periodCode LIKE :year%")
    List<AcademicPeriod> findByYear(String year);
    // Buscar períodos por una fecha específica
    @Query("SELECT ap FROM AcademicPeriod ap WHERE :date BETWEEN ap.startDate AND ap.endDate")
    Optional<AcademicPeriod> findByDate(LocalDate date);
}

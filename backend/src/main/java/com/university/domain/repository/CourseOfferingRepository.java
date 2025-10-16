package com.university.domain.repository;

import com.university.domain.model.CourseOffering;
import com.university.domain.model.enums.OfferingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CourseOfferingRepository extends JpaRepository<CourseOffering, Long> {
    List<CourseOffering> findByAcademicPeriodId(Long academicPeriodId);
    List<CourseOffering> findByCourseId(Long courseId);
    List<CourseOffering> findByProfessorId(Long professorId);
    List<CourseOffering> findByStatus(OfferingStatus status);

    // Buscar por curso y período
    @Query("SELECT co FROM CourseOffering co WHERE co.course.id = :courseId AND co.academicPeriod.id = :periodId")
    Optional<CourseOffering> findByCourseAndPeriod(@Param("courseId") Long courseId, @Param("periodId") Long periodId);
    // Buscar ofertas abiertas por período
    @Query("SELECT co FROM CourseOffering co WHERE co.academicPeriod.id = :periodId AND co.status = 'ABIERTO'")
    List<CourseOffering> findOpenOfferingsByPeriod(@Param("periodId") Long periodId);
    // Buscar ofertas del profesor en un período
    @Query("SELECT co FROM CourseOffering co WHERE co.professor.id = :professorId AND co.academicPeriod.id = :periodId")
    List<CourseOffering> findByProfessorAndPeriod(@Param("professorId") Long professorId, @Param("periodId") Long periodId);
    // Buscar ofertas con cupos disponibles
    @Query("SELECT co FROM CourseOffering co WHERE co.currentEnrollment < co.maxStudents AND co.status = 'ABIERTO'")
    List<CourseOffering> findAvailableOfferings();
}

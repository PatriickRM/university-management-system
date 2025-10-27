package com.university.domain.repository;

import com.university.domain.model.Enrollment;
import com.university.domain.model.enums.EnrollmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByStudentId(Long studentId);
    List<Enrollment> findByCourseOfferingId(Long courseOfferingId);
    List<Enrollment> findByStatus(EnrollmentStatus status);
    List<Enrollment> findByStudentIdAndStatus(Long studentId, EnrollmentStatus status);

    // Verificar si un estudiante ya está matriculado en una oferta
    @Query("SELECT e FROM Enrollment e WHERE e.student.id = :studentId AND e.courseOffering.id = :offeringId")
    Optional<Enrollment> findByStudentAndOffering(@Param("studentId") Long studentId, @Param("offeringId") Long offeringId);

    // Obtener matrículas de un estudiante en un período
    @Query("SELECT e FROM Enrollment e WHERE e.student.id = :studentId AND e.courseOffering.academicPeriod.id = :periodId")
    List<Enrollment> findByStudentAndPeriod(@Param("studentId") Long studentId, @Param("periodId") Long periodId);

    // Contar matrículas activas de un estudiante
    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.student.id = :studentId AND e.status IN ('ENROLLED', 'IN_PROGRESS')")
    Long countActiveEnrollmentsByStudent(@Param("studentId") Long studentId);

    //Contar créditos totales de un estudiante en un período
    @Query("SELECT COALESCE(SUM(e.courseOffering.course.credits), 0) FROM Enrollment e " +
            "WHERE e.student.id = :studentId " +
            "AND e.courseOffering.academicPeriod.id = :periodId " +
            "AND e.status IN ('MATRICULADO', 'EN_CURSO')")
    Long countCreditsByStudentAndPeriod(@Param("studentId") Long studentId, @Param("periodId") Long periodId);

    @Query("SELECT e FROM Enrollment e WHERE e.status = :status AND e.courseOffering.academicPeriod.id = :periodId")
    List<Enrollment> findByStatusAndAcademicPeriod(@Param("status") EnrollmentStatus status, @Param("periodId") Long periodId);

    boolean existsByStudentIdAndCourseOfferingId(Long studentId, Long courseOfferingId);
}

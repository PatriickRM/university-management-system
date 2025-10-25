package com.university.domain.repository;

import com.university.domain.model.TimeSlot;
import com.university.domain.model.enums.DayOfWeek;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalTime;
import java.util.List;

public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {
    List<TimeSlot> findByCourseOfferingId(Long courseOfferingId);

    //Verificar conflictos de horario para un estudiante
    @Query("SELECT ts FROM TimeSlot ts " +
            "JOIN ts.courseOffering co " +
            "JOIN co.enrollments e " +
            "WHERE e.student.id = :studentId " +
            "AND co.academicPeriod.id = :periodId " +
            "AND e.status IN ('MATRICULADO', 'EN_CURSO') " +
            "AND ts.dayOfWeek = :dayOfWeek " +
            "AND ((ts.startTime <= :endTime AND ts.endTime > :startTime))")
    List<TimeSlot> findConflictingTimeSlotsForStudent(
            @Param("studentId") Long studentId,
            @Param("periodId") Long periodId,
            @Param("dayOfWeek") DayOfWeek dayOfWeek,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );

    //Verificar conflictos de horario para un profesor
    @Query("SELECT ts FROM TimeSlot ts " +
            "JOIN ts.courseOffering co " +
            "WHERE co.professor.id = :professorId " +
            "AND co.academicPeriod.id = :periodId " +
            "AND co.id != :excludeOfferingId " +
            "AND ts.dayOfWeek = :dayOfWeek " +
            "AND ((ts.startTime <= :endTime AND ts.endTime > :startTime))")
    List<TimeSlot> findConflictingTimeSlotsForProfessor(
            @Param("professorId") Long professorId,
            @Param("periodId") Long periodId,
            @Param("excludeOfferingId") Long excludeOfferingId,
            @Param("dayOfWeek") DayOfWeek dayOfWeek,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );

    //Verificar conflictos en un aula
    @Query("SELECT ts FROM TimeSlot ts " +
            "JOIN ts.courseOffering co " +
            "WHERE co.academicPeriod.id = :periodId " +
            "AND co.id != :excludeOfferingId " +
            "AND ts.classroom = :classroom " +
            "AND ts.dayOfWeek = :dayOfWeek " +
            "AND ((ts.startTime <= :endTime AND ts.endTime > :startTime))")
    List<TimeSlot> findConflictingTimeSlotsForClassroom(
            @Param("periodId") Long periodId,
            @Param("excludeOfferingId") Long excludeOfferingId,
            @Param("classroom") String classroom,
            @Param("dayOfWeek") DayOfWeek dayOfWeek,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );

    //Obtener horario de un estudiante en un período
    @Query("SELECT ts FROM TimeSlot ts " +
            "JOIN ts.courseOffering co " +
            "JOIN co.enrollments e " +
            "WHERE e.student.id = :studentId " +
            "AND co.academicPeriod.id = :periodId " +
            "AND e.status IN ('MATRICULADO', 'EN_CURSO') " +
            "ORDER BY ts.dayOfWeek, ts.startTime")
    List<TimeSlot> findStudentSchedule(@Param("studentId") Long studentId,
                                       @Param("periodId") Long periodId);

    //Obtener horario de un profesor en un período
    @Query("SELECT ts FROM TimeSlot ts " +
            "JOIN ts.courseOffering co " +
            "WHERE co.professor.id = :professorId " +
            "AND co.academicPeriod.id = :periodId " +
            "ORDER BY ts.dayOfWeek, ts.startTime")
    List<TimeSlot> findProfessorSchedule(@Param("professorId") Long professorId,
                                         @Param("periodId") Long periodId);
}

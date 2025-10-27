package com.university.application.service.impl;

import com.university.domain.model.AcademicPeriod;
import com.university.domain.model.Enrollment;
import com.university.domain.model.enums.EnrollmentStatus;
import com.university.domain.model.enums.PeriodStatus;
import com.university.domain.repository.AcademicPeriodRepository;
import com.university.domain.repository.EnrollmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ScheduledTasksService {
    private final AcademicPeriodRepository periodRepository;
    private final EnrollmentRepository enrollmentRepository;

    // Ejecutar todos los días a las 00:00
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void updateEnrollmentStatuses() {
        log.info("Iniciando actualización automática de estados de matrículas");

        LocalDate today = LocalDate.now();

        // 1. Cambiar MATRICULADO A EN_CURSO (si el período está ACTIVO)
        List<AcademicPeriod> activePeriods = periodRepository.findByStatus(PeriodStatus.ACTIVO);

        for (AcademicPeriod period : activePeriods) {
            if (!today.isBefore(period.getStartDate())) {
                List<Enrollment> enrolledStudents = enrollmentRepository
                        .findByStatusAndAcademicPeriod(EnrollmentStatus.MATRICULADO, period.getId());

                for (Enrollment enrollment : enrolledStudents) {
                    enrollment.setStatus(EnrollmentStatus.EN_CURSO);
                    enrollmentRepository.save(enrollment);
                }
                log.info("Cambiados {} estudiantes a EN_CURSO en período {}",
                        enrolledStudents.size(), period.getPeriodCode());
            }
        }

        // 2. Cambiar EN_CURSO A COMPLETADO (si el período FINALIZÓ)
        List<AcademicPeriod> finishedPeriods = periodRepository.findByStatus(PeriodStatus.FINALIZADO);

        for (AcademicPeriod period : finishedPeriods) {
            List<Enrollment> inCourseStudents = enrollmentRepository
                    .findByStatusAndAcademicPeriod(EnrollmentStatus.EN_CURSO, period.getId());

            for (Enrollment enrollment : inCourseStudents) {
                enrollment.setStatus(EnrollmentStatus.COMPLETADO);
                enrollmentRepository.save(enrollment);
            }
            log.info("Cambiados {} estudiantes a COMPLETADO en período {}",
                    inCourseStudents.size(), period.getPeriodCode());
        }

        // 3. Cambiar COMPLETADO A APROBADO/REPROBADO (según nota final)
        List<Enrollment> completedEnrollments = enrollmentRepository
                .findByStatus(EnrollmentStatus.COMPLETADO);

        for (Enrollment enrollment : completedEnrollments) {
            if (enrollment.getFinalGrade() != null) {
                if (enrollment.getFinalGrade() >= 10.5) {
                    enrollment.setStatus(EnrollmentStatus.APROBADO);
                } else {
                    enrollment.setStatus(EnrollmentStatus.REPROBADO);
                }
                enrollmentRepository.save(enrollment);
            }
        }
        log.info("Procesados {} estudiantes completados", completedEnrollments.size());
    }
}
package com.university.domain.repository;

import com.university.domain.model.Course;
import com.university.domain.model.enums.CourseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findByCourseCode(String courseCode);
    boolean existsByCourseCode(String courseCode);
    List<Course> findByStatus(CourseStatus status);
    List<Course> findByDepartmentId(Long departmentId);
    List<Course> findByCourseNameContainingIgnoreCase(String courseName);
    List<Course> findByCredits(Integer credits);

    // Buscar cursos activos por departamento
    @Query("SELECT c FROM Course c WHERE c.department.id = :departmentId AND c.status = 'ACTIVO'")
    List<Course> findActiveByDepartment(@Param("departmentId") Long departmentId);
}

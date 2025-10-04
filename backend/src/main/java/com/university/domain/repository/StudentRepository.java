package com.university.domain.repository;

import com.university.domain.model.Student;
import com.university.domain.model.enums.StudentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    // Buscar por código de estudiante
    Optional<Student> findByStudentCode(String studentCode);
    Optional<Student> findByUserId(Long userId);

    @Query("SELECT s FROM Student s WHERE s.user.email = :email")
    Optional<Student> findByUserEmail(@Param("email") String email);

    boolean existsByStudentCode(String studentCode);
    boolean existsByUserId(Long userId);

    List<Student> findByCareerIdAndAcademicStatus(Long careerId, StudentStatus status);
    List<Student> findByAcademicStatus(StudentStatus status);
    // Buscar por semestre actual
    List<Student> findByCurrentSemester(Integer semester);

    // Estudiantes con deuda
    @Query("SELECT s FROM Student s WHERE s.totalDebt > 0")
    List<Student> findStudentsWithDebt();
}

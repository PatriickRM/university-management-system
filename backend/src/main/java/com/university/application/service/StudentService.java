package com.university.application.service;

import com.university.domain.model.enums.StudentStatus;
import com.university.web.dto.student.StudentCreateRequestDTO;
import com.university.web.dto.student.StudentResponseDTO;
import com.university.web.dto.student.StudentUpdateRequestDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface StudentService {
    //CRUD
    StudentResponseDTO createStudent(StudentCreateRequestDTO dto);
    StudentResponseDTO getStudentById(Long id);
    StudentResponseDTO updateStudent(Long id, StudentUpdateRequestDTO dto);
    void deleteStudent(Long id);

    //BUSQUEDA
    List<StudentResponseDTO> getAllStudents();
    Page<StudentResponseDTO> getAllStudentsPageable(Pageable pageable);
    StudentResponseDTO getStudentByStudentCode(String studentCode);
    StudentResponseDTO getStudentByUserId(Long userId);
    StudentResponseDTO getStudentByUserEmail(String email);

    //FILTRO DE BUSQUEDA
    List<StudentResponseDTO> getStudentsByCareer(Long careerId);
    List<StudentResponseDTO> getStudentsByStatus(StudentStatus status);
    List<StudentResponseDTO> getStudentsBySemester(Integer semester);
    List<StudentResponseDTO> getStudentsWithDebt();
}

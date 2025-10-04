package com.university.application.validator;

import com.university.application.exception.ErrorSistema;
import com.university.domain.model.Student;
import com.university.domain.repository.CareerRepository;
import com.university.domain.repository.StudentRepository;
import com.university.domain.repository.UserRepository;
import com.university.web.dto.student.StudentCreateRequestDTO;
import com.university.web.dto.student.StudentUpdateRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class StudentValidator {
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final CareerRepository careerRepository;

    public void validateStudentCreation(StudentCreateRequestDTO dto) {
        // Validar código de estudiante único
        if (studentRepository.existsByStudentCode(dto.getStudentCode())) {
            throw new ErrorSistema("Ya existe el código del estudiante: " + dto.getStudentCode());
        }

        // Validar que el email del usuario no exista
        if (userRepository.existsByEmail(dto.getUserInfo().getEmail())) {
            throw new ErrorSistema("El correo registrado ya existe: " + dto.getUserInfo().getEmail());
        }

        // Validar que el username no exista
        if (userRepository.existsByUsername(dto.getUserInfo().getUsername())) {
            throw new ErrorSistema("Nombre de usuario ya existe: " + dto.getUserInfo().getUsername());
        }

        // Validar que la carrera exista
        if (!careerRepository.existsById(dto.getCareerId())) {
            throw new ErrorSistema("Carrera con ID no encontrada: " + dto.getCareerId());
        }
    }

    public void validateStudentUpdate(Student student, StudentUpdateRequestDTO dto) {
        // Validar que la carrera exista si se está actualizando
        if (dto.getCareerId() != null && !careerRepository.existsById(dto.getCareerId())) {
            throw new ErrorSistema("Carrera con ID no encontrada: " + dto.getCareerId());
        }
    }
}


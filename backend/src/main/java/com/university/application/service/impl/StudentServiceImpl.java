package com.university.application.service.impl;

import com.university.application.exception.ErrorSistema;
import com.university.application.mapper.StudentMapper;
import com.university.application.mapper.UserMapper;
import com.university.application.service.StudentService;
import com.university.application.validator.StudentValidator;
import com.university.domain.model.Career;
import com.university.domain.model.Role;
import com.university.domain.model.Student;
import com.university.domain.model.User;
import com.university.domain.model.enums.StudentStatus;
import com.university.domain.repository.CareerRepository;
import com.university.domain.repository.RoleRepository;
import com.university.domain.repository.StudentRepository;
import com.university.domain.repository.UserRepository;
import com.university.web.dto.student.StudentCreateRequestDTO;
import com.university.web.dto.student.StudentResponseDTO;
import com.university.web.dto.student.StudentUpdateRequestDTO;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional
public class StudentServiceImpl implements StudentService {
    private final StudentMapper studentMapper;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final CareerRepository careerRepository;
    private final StudentValidator studentValidator;

    @Override
    public StudentResponseDTO createStudent(StudentCreateRequestDTO dto) {
        //Validación
        studentValidator.validateStudentCreation(dto);
        //Crear usuario
        User user = userMapper.toEntity(dto.getUserInfo());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        //Asignar rol STUDENT
        Role studentRole = roleRepository.findByName("STUDENT")
                .orElseThrow(() -> new ErrorSistema("Rol STUDENT no existe"));
        user.setRoles(Set.of(studentRole));
        User savedUser = userRepository.save(user);

        //Crear Estudiante
        Student student = studentMapper.toEntity(dto);
        student.setUser(savedUser);

        //Asignar carrera
        Career career = careerRepository.findById(dto.getCareerId())
                .orElseThrow(() -> new ErrorSistema("ID De carrera no encontrada" + dto.getCareerId()));
        student.setCareer(career);

        //Guardar
        Student savedStudent = studentRepository.save(student);
        return studentMapper.toResponseDTO(savedStudent);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentResponseDTO getStudentById(Long id) {
        Student existStudent = studentRepository.findById(id)
                .orElseThrow(() -> new ErrorSistema("Estudiante de ID: " + id + " no encontrada"));
        return studentMapper.toResponseDTO(existStudent);
    }

    @Override
    public StudentResponseDTO updateStudent(Long id, StudentUpdateRequestDTO dto) {
        Student existStudent = studentRepository.findById(id)
                .orElseThrow(() -> new ErrorSistema("Estudiante de ID: " + id + " no encontrada"));
        //Validar
        studentValidator.validateStudentUpdate(existStudent,dto);
       //Actualizar
        studentMapper.updateEntity(existStudent,dto);
        // Actualizar carrera si viene en el DTO
        if (dto.getCareerId() != null) {
            Career career = careerRepository.findById(dto.getCareerId())
                    .orElseThrow(() -> new ErrorSistema("ID de carrera no encontrada: " + dto.getCareerId()));
            existStudent.setCareer(career);
        }
        Student updatedStudent = studentRepository.save(existStudent);

        return studentMapper.toResponseDTO(updatedStudent);
    }

    @Override
    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ErrorSistema("Estudiante de ID: " + id + " no encontrada"));

        // Cambiar estado a Inactivo
        student.setAcademicStatus(StudentStatus.INACTIVO);
        studentRepository.save(student);

    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentResponseDTO> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(studentMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StudentResponseDTO> getAllStudentsPageable(Pageable pageable) {
        return studentRepository.findAll(pageable).map(studentMapper::toResponseDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentResponseDTO getStudentByStudentCode(String studentCode) {
        Student student = studentRepository.findByStudentCode(studentCode)
                .orElseThrow(() -> new ErrorSistema("Estudiante de código: " + studentCode + " no encontrada"));
        return studentMapper.toResponseDTO(student);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentResponseDTO getStudentByUserId(Long userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ErrorSistema("Estudiante con ID: " + userId + " no encontrada"));

        return studentMapper.toResponseDTO(student);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentResponseDTO getStudentByUserEmail(String email) {
        Student student = studentRepository.findByUserEmail(email)
                .orElseThrow(() -> new ErrorSistema("Estudiante con ID: " + email + " no encontrada"));

        return studentMapper.toResponseDTO(student);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentResponseDTO> getStudentsByCareer(Long careerId) {
        return studentRepository.findByCareerIdAndAcademicStatus(careerId, StudentStatus.ACTIVO).stream()
                .map(studentMapper::toResponseDTO)
                .collect(Collectors.toList());

    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentResponseDTO> getStudentsByStatus(StudentStatus status) {
        return studentRepository.findByAcademicStatus(status).stream()
                .map(studentMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentResponseDTO> getStudentsBySemester(Integer semester) {
        return studentRepository.findByCurrentSemester(semester).stream()
                .map(studentMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentResponseDTO> getStudentsWithDebt() {
        return studentRepository.findStudentsWithDebt().stream()
                .map(studentMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}

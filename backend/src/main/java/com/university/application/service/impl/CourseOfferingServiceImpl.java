package com.university.application.service.impl;

import com.university.application.exception.ErrorSistema;
import com.university.application.mapper.CourseOfferingMapper;
import com.university.application.service.CourseOfferingService;
import com.university.application.validator.CourseOfferingValidator;
import com.university.domain.model.AcademicPeriod;
import com.university.domain.model.Course;
import com.university.domain.model.CourseOffering;
import com.university.domain.model.Professor;
import com.university.domain.model.enums.OfferingStatus;
import com.university.domain.repository.AcademicPeriodRepository;
import com.university.domain.repository.CourseOfferingRepository;
import com.university.domain.repository.CourseRepository;
import com.university.domain.repository.ProfessorRepository;
import com.university.web.dto.courseoffering.CourseOfferingCreateRequestDTO;
import com.university.web.dto.courseoffering.CourseOfferingResponseDTO;
import com.university.web.dto.courseoffering.CourseOfferingUpdateRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CourseOfferingServiceImpl implements CourseOfferingService {

    private final CourseOfferingRepository courseOfferingRepository;
    private final CourseRepository courseRepository;
    private final AcademicPeriodRepository academicPeriodRepository;
    private final ProfessorRepository professorRepository;
    private final CourseOfferingMapper courseOfferingMapper;
    private final CourseOfferingValidator courseOfferingValidator;

    @Override
    public CourseOfferingResponseDTO createCourseOffering(CourseOfferingCreateRequestDTO dto) {
        courseOfferingValidator.validateCourseOfferingCreation(dto);

        CourseOffering courseOffering = courseOfferingMapper.toEntity(dto);

        //Asignar Curso
        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new ErrorSistema("Curso ofertado con ID no encontrado: " + dto.getCourseId()));
        courseOffering.setCourse(course);

        // Asignar Periodo academico
        AcademicPeriod academicPeriod = academicPeriodRepository.findById(dto.getAcademicPeriodId())
                .orElseThrow(() -> new ErrorSistema("Periodo Academico con ID no encontrado: " + dto.getAcademicPeriodId()));
        courseOffering.setAcademicPeriod(academicPeriod);

        //Asignar Profesor
        Professor professor = professorRepository.findById(dto.getProfessorId())
                .orElseThrow(() -> new ErrorSistema("Profesor con ID no encontrado: " + dto.getProfessorId()));
        courseOffering.setProfessor(professor);

        CourseOffering savedOffering = courseOfferingRepository.save(courseOffering);

        return courseOfferingMapper.toResponseDTO(savedOffering);
    }

    @Override
    @Transactional(readOnly = true)
    public CourseOfferingResponseDTO getCourseOfferingById(Long id) {
        CourseOffering courseOffering = courseOfferingRepository.findById(id)
                .orElseThrow(() -> new ErrorSistema("Curso ofertado con ID no encontrado: " + id));

        return courseOfferingMapper.toResponseDTO(courseOffering);
    }

    @Override
    public CourseOfferingResponseDTO updateCourseOffering(Long id, CourseOfferingUpdateRequestDTO dto) {
        CourseOffering existingOffering = courseOfferingRepository.findById(id)
                .orElseThrow(() -> new ErrorSistema("Curso ofertado con ID no encontrado: " + id));

        courseOfferingValidator.validateCourseOfferingUpdate(existingOffering, dto);

        courseOfferingMapper.updateEntity(existingOffering, dto);

        //Actualizar profesor si viene en el DTO
        if (dto.getProfessorId() != null) {
            Professor professor = professorRepository.findById(dto.getProfessorId())
                    .orElseThrow(() -> new ErrorSistema("Profesor con ID no encontrado: " + dto.getProfessorId()));
            existingOffering.setProfessor(professor);
        }

        CourseOffering updatedOffering = courseOfferingRepository.save(existingOffering);

        return courseOfferingMapper.toResponseDTO(updatedOffering);
    }

    @Override
    public void deleteCourseOffering(Long id) {
        CourseOffering courseOffering = courseOfferingRepository.findById(id)
                .orElseThrow(() -> new ErrorSistema("Curso ofertado con ID no encontrado: " + id));

        //Verificar que no tenga inscritos
        if (courseOffering.getEnrollments() != null && !courseOffering.getEnrollments().isEmpty()) {
            throw new ErrorSistema("No puedes borrar un curso con estudiantes inscritos!");
        }

        courseOfferingRepository.delete(courseOffering);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseOfferingResponseDTO> getAllCourseOfferings() {
        return courseOfferingRepository.findAll().stream()
                .map(courseOfferingMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CourseOfferingResponseDTO> getAllCourseOfferingsPageable(Pageable pageable) {
        return courseOfferingRepository.findAll(pageable)
                .map(courseOfferingMapper::toResponseDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseOfferingResponseDTO> getCourseOfferingsByPeriod(Long academicPeriodId) {
        return courseOfferingRepository.findByAcademicPeriodId(academicPeriodId).stream()
                .map(courseOfferingMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseOfferingResponseDTO> getCourseOfferingsByCourse(Long courseId) {
        return courseOfferingRepository.findByCourseId(courseId).stream()
                .map(courseOfferingMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseOfferingResponseDTO> getCourseOfferingsByProfessor(Long professorId) {
        return courseOfferingRepository.findByProfessorId(professorId).stream()
                .map(courseOfferingMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseOfferingResponseDTO> getCourseOfferingsByStatus(OfferingStatus status) {
        return courseOfferingRepository.findByStatus(status).stream()
                .map(courseOfferingMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseOfferingResponseDTO> getOpenOfferingsByPeriod(Long academicPeriodId) {
        return courseOfferingRepository.findOpenOfferingsByPeriod(academicPeriodId).stream()
                .map(courseOfferingMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseOfferingResponseDTO> getAvailableOfferings() {
        return courseOfferingRepository.findAvailableOfferings().stream()
                .map(courseOfferingMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseOfferingResponseDTO> getCourseOfferingsByProfessorAndPeriod(Long professorId, Long periodId) {
        return courseOfferingRepository.findByProfessorAndPeriod(professorId, periodId).stream()
                .map(courseOfferingMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void openOffering(Long id) {
        CourseOffering offering = courseOfferingRepository.findById(id)
                .orElseThrow(() -> new ErrorSistema("Curso ofertado con ID no encontrado: " + id));

        offering.setStatus(OfferingStatus.ABIERTO);
        courseOfferingRepository.save(offering);
    }

    @Override
    public void closeOffering(Long id) {
        CourseOffering offering = courseOfferingRepository.findById(id)
                .orElseThrow(() -> new ErrorSistema("Curso ofertado con ID no encontrado: " + id));

        offering.setStatus(OfferingStatus.CERRADO);
        courseOfferingRepository.save(offering);
    }

    @Override
    public void startOffering(Long id) {
        CourseOffering offering = courseOfferingRepository.findById(id)
                .orElseThrow(() -> new ErrorSistema("Curso ofertado con ID no encontrado: " + id));

        offering.setStatus(OfferingStatus.EN_CURSO);
        courseOfferingRepository.save(offering);
    }

    @Override
    public void completeOffering(Long id) {
        CourseOffering offering = courseOfferingRepository.findById(id)
                .orElseThrow(() -> new ErrorSistema("Curso ofertado con ID no encontrado: " + id));

        offering.setStatus(OfferingStatus.COMPLETADO);
        courseOfferingRepository.save(offering);
    }

    @Override
    public void cancelOffering(Long id) {
        CourseOffering offering = courseOfferingRepository.findById(id)
                .orElseThrow(() -> new ErrorSistema("Curso ofertado con ID no encontrado: " + id));

        offering.setStatus(OfferingStatus.CANCELADO);
        courseOfferingRepository.save(offering);
    }

    @Override
    public void incrementEnrollment(Long id) {
        CourseOffering offering = courseOfferingRepository.findById(id)
                .orElseThrow(() -> new ErrorSistema("Curso ofertado con ID no encontrado: " + id));

        if (offering.getCurrentEnrollment() >= offering.getMaxStudents()) {
            throw new ErrorSistema("Curso Ofertado se encuentra lleno!");
        }

        offering.setCurrentEnrollment(offering.getCurrentEnrollment() + 1);

        //Si se llena, cerrar automáticamente
        if (offering.getCurrentEnrollment().equals(offering.getMaxStudents())) {
            offering.setStatus(OfferingStatus.CERRADO);
        }

        courseOfferingRepository.save(offering);
    }

    @Override
    public void decrementEnrollment(Long id) {
        CourseOffering offering = courseOfferingRepository.findById(id)
                .orElseThrow(() -> new ErrorSistema("Oferta de curso con ID no encontrado: " + id));

        if (offering.getCurrentEnrollment() <= 0) {
            throw new ErrorSistema("Los inscritos ya son 0");
        }

        offering.setCurrentEnrollment(offering.getCurrentEnrollment() - 1);

        //Si estaba cerrado por lleno, abrirlo de nuevo
        if (offering.getStatus() == OfferingStatus.CERRADO && offering.getCurrentEnrollment() < offering.getMaxStudents()) {
            offering.setStatus(OfferingStatus.ABIERTO);
        }

        courseOfferingRepository.save(offering);
    }
}
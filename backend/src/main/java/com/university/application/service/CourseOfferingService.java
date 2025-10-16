package com.university.application.service;

import com.university.domain.model.enums.OfferingStatus;
import com.university.web.dto.courseoffering.CourseOfferingCreateRequestDTO;
import com.university.web.dto.courseoffering.CourseOfferingResponseDTO;
import com.university.web.dto.courseoffering.CourseOfferingUpdateRequestDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CourseOfferingService {
    //CRUD
    CourseOfferingResponseDTO createCourseOffering(CourseOfferingCreateRequestDTO dto);
    CourseOfferingResponseDTO getCourseOfferingById(Long id);
    CourseOfferingResponseDTO updateCourseOffering(Long id, CourseOfferingUpdateRequestDTO dto);
    void deleteCourseOffering(Long id);

    //Búsquedas
    List<CourseOfferingResponseDTO> getAllCourseOfferings();
    Page<CourseOfferingResponseDTO> getAllCourseOfferingsPageable(Pageable pageable);
    List<CourseOfferingResponseDTO> getCourseOfferingsByPeriod(Long academicPeriodId);
    List<CourseOfferingResponseDTO> getCourseOfferingsByCourse(Long courseId);
    List<CourseOfferingResponseDTO> getCourseOfferingsByProfessor(Long professorId);
    List<CourseOfferingResponseDTO> getCourseOfferingsByStatus(OfferingStatus status);
    List<CourseOfferingResponseDTO> getOpenOfferingsByPeriod(Long academicPeriodId);
    List<CourseOfferingResponseDTO> getAvailableOfferings();
    List<CourseOfferingResponseDTO> getCourseOfferingsByProfessorAndPeriod(Long professorId, Long periodId);

    //Acciones
    void openOffering(Long id);
    void closeOffering(Long id);
    void startOffering(Long id);
    void completeOffering(Long id);
    void cancelOffering(Long id);
    void incrementEnrollment(Long id);
    void decrementEnrollment(Long id);

}

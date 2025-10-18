package com.university.application.service;

import com.university.domain.model.enums.CareerStatus;
import com.university.web.dto.career.CareerCreateRequestDTO;
import com.university.web.dto.career.CareerResponseDTO;
import com.university.web.dto.career.CareerUpdateRequestDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CareerService {
    //CRUD
    CareerResponseDTO createCareer(CareerCreateRequestDTO dto);
    CareerResponseDTO getCareerById(Long id);
    CareerResponseDTO updateCareer(Long id, CareerUpdateRequestDTO dto);
    void deleteCareer(Long id);
    //Búsquedas
    List<CareerResponseDTO> getAllCareers();
    Page<CareerResponseDTO> getAllCareersPageable(Pageable pageable);
    CareerResponseDTO getCareerByCode(String careerCode);
    List<CareerResponseDTO> getCareersByStatus(CareerStatus status);
    List<CareerResponseDTO> getCareersByDepartment(Long departmentId);
    List<CareerResponseDTO> getActiveCareersByDepartment(Long departmentId);
    List<CareerResponseDTO> searchCareersByName(String name);

}

package com.university.application.service;

import com.university.domain.model.enums.UserStatus;
import com.university.web.dto.user.UserCreateRequestDTO;
import com.university.web.dto.user.UserResponseDTO;
import com.university.web.dto.user.UserUpdateRequestDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


import java.util.List;

public interface UserService {
    UserResponseDTO createUser(UserCreateRequestDTO dto);
    UserResponseDTO getUserById(Long id);
    UserResponseDTO updateUser(Long id, UserUpdateRequestDTO dto);
    void activateUser(Long id);
    void deactivateUser(Long id);
    UserResponseDTO getUserByEmail(String email);
    List<UserResponseDTO> getUsersByStatus(UserStatus status);
    List<UserResponseDTO> getUsersByRole(String roleName);
    List<UserResponseDTO> getAllUsers();
    Page<UserResponseDTO> getAllUsersPageable(Pageable pageable);
    List<UserResponseDTO> searchUsers(String query);
}

package com.university.application.mapper;

import com.university.domain.model.Role;
import com.university.domain.model.User;
import com.university.web.dto.role.RoleDTO;
import com.university.web.dto.user.UserCreateRequestDTO;
import com.university.web.dto.user.UserResponseDTO;
import com.university.web.dto.user.UserUpdateRequestDTO;

import java.util.Set;

public interface UserMapper {
    User toEntity(UserCreateRequestDTO dto);
    void updateEntity(User user, UserUpdateRequestDTO dto);
    UserResponseDTO toResponseDTO(User user);
    Set<String> getRoleNames(Set<Role> roles);
    Set<RoleDTO> toRoleDTOs(Set<Role> roles);
}

package com.university.application.mapper.impl;

import com.university.application.mapper.UserMapper;
import com.university.domain.model.Role;
import com.university.domain.model.User;
import com.university.domain.model.enums.UserStatus;
import com.university.web.dto.role.RoleDTO;
import com.university.web.dto.user.UserCreateRequestDTO;
import com.university.web.dto.user.UserResponseDTO;
import com.university.web.dto.user.UserUpdateRequestDTO;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public User toEntity(UserCreateRequestDTO dto) {
        return User.builder()
                .email(dto.getEmail())
                .username(dto.getUsername())
                .password(dto.getPassword())
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .phoneNumber(dto.getPhoneNumber())
                .address(dto.getAddress())
                .dateOfBirth(dto.getDateOfBirth())
                .nationalId(dto.getNationalId())
                .gender(dto.getGender())
                .profileImageUrl(dto.getProfileImageUrl())
                .status(UserStatus.ACTIVO)
                .build();
    }

    @Override
    public void updateEntity(User user, UserUpdateRequestDTO dto) {
        if (dto.getUsername() != null) user.setUsername(dto.getUsername());
        if(dto.getEmail() != null) user.setEmail(dto.getEmail());
        if (dto.getFirstName() != null) user.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) user.setLastName(dto.getLastName());
        if (dto.getPhoneNumber() != null) user.setPhoneNumber(dto.getPhoneNumber());
        if (dto.getAddress() != null) user.setAddress(dto.getAddress());
        if (dto.getDateOfBirth() != null) user.setDateOfBirth(dto.getDateOfBirth());
        if (dto.getNationalId() != null) user.setNationalId(dto.getNationalId());
        if (dto.getGender() != null) user.setGender(dto.getGender());
        if (dto.getProfileImageUrl() != null) user.setProfileImageUrl(dto.getProfileImageUrl());
    }

    @Override
    public UserResponseDTO toResponseDTO(User user) {
        return UserResponseDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phoneNumber(user.getPhoneNumber())
                .address(user.getAddress())
                .dateOfBirth(user.getDateOfBirth())
                .nationalId(user.getNationalId())
                .gender(user.getGender())
                .status(user.getStatus())
                .profileImageUrl(user.getProfileImageUrl())
                .roles(toRoleDTOs(user.getRoles()))
                .build();

    }

    @Override
    public Set<String> getRoleNames(Set<Role> roles) {
        return roles.stream()
                .map(Role::getName)
                .collect(Collectors.toSet());
    }

    @Override
    public Set<RoleDTO> toRoleDTOs(Set<Role> roles) {
        return roles.stream()
                .map(role -> RoleDTO.builder()
                        .id(role.getId())
                        .name(role.getName())
                        .build())
                .collect(Collectors.toSet());
    }
}

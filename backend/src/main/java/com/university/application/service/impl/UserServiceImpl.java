package com.university.application.service.impl;

import com.university.application.exception.ErrorSistema;
import com.university.application.mapper.UserMapper;
import com.university.application.service.UserService;
import com.university.application.validator.UserValidator;
import com.university.domain.model.Role;
import com.university.domain.model.User;
import com.university.domain.model.enums.UserStatus;
import com.university.domain.repository.RoleRepository;
import com.university.domain.repository.UserRepository;
import com.university.web.dto.user.UserCreateRequestDTO;
import com.university.web.dto.user.UserResponseDTO;
import com.university.web.dto.user.UserUpdateRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final UserValidator userValidator;


    @Override
    @Transactional
    public UserResponseDTO createUser(UserCreateRequestDTO dto) {
        userValidator.validateUserCreation(dto);

        User user = userMapper.toEntity(dto);
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        Set<Role> roles = assignRoles(dto.getRoleNames());
        user.setRoles(roles);

        User savedUser = userRepository.save(user);
        return userMapper.toResponseDTO(savedUser);

    }

    @Override
    @Transactional(readOnly = true)
    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ErrorSistema("User not found with ID: " + id));

        return userMapper.toResponseDTO(user);

    }

    @Override
    @Transactional
    public UserResponseDTO updateUser(Long id, UserUpdateRequestDTO dto) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new ErrorSistema("User not found with ID: " + id));

        userValidator.validateUserUpdate(existingUser, dto);
        userMapper.updateEntity(existingUser, dto);

        //Un usuario puede tener multiples roles ya sea que un profesor sea admin o un profesor sea estudiante
        if (dto.getRoleNames() != null && !dto.getRoleNames().isEmpty()) {
            Set<Role> newRoles = assignRoles(dto.getRoleNames());
            existingUser.setRoles(newRoles);
        }

        User updatedUser = userRepository.save(existingUser);
        return userMapper.toResponseDTO(updatedUser);

    }

    @Override
    @Transactional
    public void activateUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ErrorSistema("User not found with ID: " + id));

        user.setStatus(UserStatus.ACTIVO);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void deactivateUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ErrorSistema("User not found with ID: " + id));

        user.setStatus(UserStatus.INACTIVO);
        userRepository.save(user);
    }

    @Override
    public UserResponseDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ErrorSistema("User not found with email: " + email));

        return userMapper.toResponseDTO(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponseDTO> getUsersByStatus(UserStatus status) {
        return userRepository.findByStatus(status).stream()
                .map(userMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponseDTO> getUsersByRole(String roleName) {
        return userRepository.findByRoleName(roleName).stream()
                .map(userMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserResponseDTO> getAllUsersPageable(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(userMapper::toResponseDTO);
    }

    private Set<Role> assignRoles(Set<String> roleNames) {
        if (roleNames == null || roleNames.isEmpty()) {
            throw new ErrorSistema("Asignar al menos un rol!");
        }
        Set<Role> roles = new HashSet<>();
        for (String roleName : roleNames) {
            Role role = roleRepository.findByName(roleName.toUpperCase())
                    .orElseThrow(() -> new ErrorSistema("Rol no encontrado: " + roleName));
            roles.add(role);
        }

        return roles;
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponseDTO> searchUsers(String query) {
        if (query == null || query.trim().isEmpty()) {
            return new ArrayList<>();
        }

        String searchQuery = query.trim().toLowerCase();

        return userRepository.findAll().stream()
                .filter(user -> {
                    String fullName = (user.getFirstName() + " " + user.getLastName()).toLowerCase();
                    String email = user.getEmail().toLowerCase();
                    String username = user.getUsername().toLowerCase();

                    return fullName.contains(searchQuery) ||
                            email.contains(searchQuery) ||
                            username.contains(searchQuery);
                })
                .map(userMapper::toResponseDTO)
                .limit(10) // 10 resultados
                .collect(Collectors.toList());
    }

    }

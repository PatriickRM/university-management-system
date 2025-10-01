package com.university.application.validator;

import com.university.application.exception.ErrorSistema;
import com.university.domain.model.User;
import com.university.domain.repository.UserRepository;
import com.university.web.dto.user.UserCreateRequestDTO;
import com.university.web.dto.user.UserUpdateRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserValidator {
    private final UserRepository userRepository;
    public void validateUserCreation(UserCreateRequestDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new ErrorSistema("Email already exists: " + dto.getEmail());
        }

        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new ErrorSistema("Username already exists: " + dto.getUsername());
        }

        if (userRepository.existsByNationalId(dto.getNationalId())) {
            throw new ErrorSistema("National ID already exists: " + dto.getNationalId());
        }
    }

    public void validateUserUpdate(User existingUser, UserUpdateRequestDTO dto) {
        // Validar email único (si cambió)
        if (dto.getEmail() != null && !dto.getEmail().equals(existingUser.getEmail())) {
            if (userRepository.existsByEmail(dto.getEmail())) {
                throw new ErrorSistema("Email already exists: " + dto.getEmail());
            }
        }

        // Validar username único (si cambió)
        if (dto.getUsername() != null && !dto.getUsername().equals(existingUser.getUsername())) {
            if (userRepository.existsByUsername(dto.getUsername())) {
                throw new ErrorSistema("Username already exists: " + dto.getUsername());
            }
        }

        // Validar national ID único (si cambió)
        if (dto.getNationalId() != null && !dto.getNationalId().equals(existingUser.getNationalId())) {
            if (userRepository.existsByNationalId(dto.getNationalId())) {
                throw new ErrorSistema("National ID already exists: " + dto.getNationalId());
            }
        }
    }

    public void validateUserExists(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ErrorSistema("User not found with ID: " + id);
        }
    }
}

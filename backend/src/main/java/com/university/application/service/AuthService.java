package com.university.application.service;

import com.university.web.dto.auth.LoginRequestDTO;
import com.university.web.dto.auth.LoginResponseDTO;
import com.university.web.dto.user.UserResponseDTO;

public interface AuthService {
    LoginResponseDTO login(LoginRequestDTO dto);
    UserResponseDTO getCurrentUser(String username);
}

package com.university.application.service.impl;

import com.university.application.exception.ErrorSistema;
import com.university.application.mapper.UserMapper;
import com.university.application.service.AuthService;
import com.university.application.service.UserService;
import com.university.domain.model.User;
import com.university.domain.repository.UserRepository;
import com.university.security.util.JwtUtil;
import com.university.web.dto.auth.LoginRequestDTO;
import com.university.web.dto.auth.LoginResponseDTO;
import com.university.web.dto.user.UserResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final UserService userService;
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    public LoginResponseDTO login(LoginRequestDTO dto) {
        //Autenticar al usuario que se loguea
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(dto.getUsername(),dto.getPassword()));
        //Cargar detalles de usuario
        UserDetails userDetails = userDetailsService.loadUserByUsername(dto.getUsername());
        //Buscar usuario completo para response
        User user = userRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new ErrorSistema("Usuario no encontrado"));
        //Crear claims adicionales
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("email", user.getEmail());
        claims.put("roles", user.getRoles().stream()
                .map(role -> role.getName())
                .collect(Collectors.toList()));
        //Generar token
        String token = jwtUtil.generateToken(userDetails, claims);

        //Crear response
        return LoginResponseDTO.builder()
                .token(token)
                .expiresIn(jwtUtil.getExpirationInSeconds())
                .email(user.getEmail())
                .username(user.getUsername())
                .roles(userMapper.toRoleDTOs(user.getRoles()))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponseDTO getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ErrorSistema("Usuario no encontrado"));
        return userMapper.toResponseDTO(user);
    }
}

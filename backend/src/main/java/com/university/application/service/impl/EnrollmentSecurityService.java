package com.university.application.service.impl;

import com.university.domain.repository.EnrollmentRepository;
import com.university.domain.repository.StudentRepository;
import com.university.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service("enrollmentSecurityService")
@RequiredArgsConstructor
public class EnrollmentSecurityService {
    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;

    //Verificar si el usuario puede matricularse (es el estudiante dueño)
    public boolean canEnroll(Long studentId) {
        if (studentId == null) return false;

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (!isAuthenticated(auth)) return false;

        if (isAdmin(auth)) return true;

        Long authUserId = getAuthenticatedUserId(auth);
        if (authUserId == null) return false;

        return studentRepository.findByUserId(authUserId)
                .map(s -> Objects.equals(s.getId(), studentId))
                .orElse(false);
    }

    //Verificar si el usuario es dueño de la matrícula
    public boolean isEnrollmentOwner(Long enrollmentId) {
        if (enrollmentId == null) return false;

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (!isAuthenticated(auth)) return false;

        if (isAdmin(auth)) return true;

        Long authUserId = getAuthenticatedUserId(auth);
        if (authUserId == null) return false;

        return enrollmentRepository.findById(enrollmentId)
                .flatMap(enrollment -> studentRepository.findByUserId(authUserId)
                        .map(student -> Objects.equals(enrollment.getStudent().getId(), student.getId())))
                .orElse(false);
    }

    //Métodos auxiliares
    private boolean isAuthenticated(Authentication auth) {
        return auth != null && auth.isAuthenticated() && !(auth instanceof AnonymousAuthenticationToken);
    }

    private boolean isAdmin(Authentication auth) {
        return auth.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
    }

    private Long getAuthenticatedUserId(Authentication auth) {
        Object principal = auth.getPrincipal();
        if (principal instanceof CustomUserDetails) {
            return ((CustomUserDetails) principal).getUserId();
        }
        return null;
    }
}
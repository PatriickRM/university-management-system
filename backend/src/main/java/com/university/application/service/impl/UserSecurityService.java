package com.university.application.service.impl;

import com.university.domain.model.Student;
import com.university.domain.repository.StudentRepository;
import com.university.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Optional;

@Service("userSecurityService")
@RequiredArgsConstructor
public class UserSecurityService {
    private final StudentRepository studentRepository;

    public boolean isOwner(Long userId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (!isAuthenticated(auth)) return false;

        if (isAdmin(auth)) return true;

        Long authUserId = getAuthenticatedUserId(auth);
        return authUserId != null && Objects.equals(userId, authUserId);
    }

    public boolean isStudentOwner(Long studentId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (!isAuthenticated(auth)) return false;

        if (isAdmin(auth)) return true;

        Long authUserId = getAuthenticatedUserId(auth);
        if (authUserId == null || studentId == null) return false;

        return studentRepository.findByUserId(authUserId)
                .map(s -> Objects.equals(s.getId(), studentId))
                .orElse(false);
    }

    public boolean isStudentOwnerByCode(String studentCode) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (!isAuthenticated(auth)) return false;

        if (isAdmin(auth)) return true;

        Long authUserId = getAuthenticatedUserId(auth);
        if (authUserId == null || studentCode == null) return false;

        return studentRepository.findByUserId(authUserId)
                .map(s -> Objects.equals(s.getStudentCode(), studentCode))
                .orElse(false);
    }


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
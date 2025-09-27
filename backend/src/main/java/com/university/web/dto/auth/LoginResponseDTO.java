package com.university.web.dto.auth;

import com.university.web.dto.role.RoleDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Set;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponseDTO {
    private String token;
    private Long expiresIn;
    private String email;
    private String username;
    private Set<RoleDTO> roles;
}

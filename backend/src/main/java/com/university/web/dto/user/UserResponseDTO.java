package com.university.web.dto.user;

import com.university.domain.model.enums.Gender;
import com.university.domain.model.enums.UserStatus;
import com.university.web.dto.role.RoleDTO;

import java.time.LocalDate;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDTO {
    private Long id;
    private String email;
    private String username;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String address;
    private LocalDate dateOfBirth;
    private String nationalId;
    private Gender gender;
    private UserStatus status;
    private String profileImageUrl;
    private Set<RoleDTO> roles;
}

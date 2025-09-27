package com.university.web.dto.user;

import com.university.domain.model.enums.Gender;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateRequestDTO {
    private String username;
    private String firstName;
    private String lastName;
    @Pattern(regexp = "\\d{9}", message = "Phone number must have 9 digits")
    private String phoneNumber;
    private String address;
    private LocalDate dateOfBirth;
    private String nationalId;
    private Gender gender;
    private String profileImageUrl;
    private Set<String> roleNames = new HashSet<>();
}
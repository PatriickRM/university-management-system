package com.university.web.dto.user;

import com.university.domain.model.enums.Gender;
import jakarta.validation.constraints.*;
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
public class UserCreateRequestDTO {
    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;
    @NotBlank(message = "Username is required")
    private String username;
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must have at least 8 characters")
    private String password;
    private String firstName;
    private String lastName;
    @Pattern(regexp = "\\d{9}", message = "Phone number must have 9 digits")
    private String phoneNumber;
    private String address;
    @NotNull(message = "Date of birth is required")
    private LocalDate dateOfBirth;
    @NotBlank(message = "National ID is required")
    private String nationalId;

    @NotNull(message = "Gender is required")
    private Gender gender;

    private String profileImageUrl;

    private Set<String> roleNames = new HashSet<>();
}

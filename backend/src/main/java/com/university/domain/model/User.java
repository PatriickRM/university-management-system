package com.university.domain.model;

import com.university.domain.model.enums.Gender;
import com.university.domain.model.enums.UserStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Set;

@Entity
@Table(name="users")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, nullable = false)
    private String email;
    @Column(unique = true, nullable = false)
    private String username;
    @Column(nullable = false)
    private String password;
    @Column(nullable = false)
    private String firstName;
    private String lastName;
    @Column(nullable = false)
    private String phoneNumber;
    private String address;
    @Column(nullable = false)
    private LocalDate dateOfBirth;
    @Column(nullable = false)
    private String nationalId;
    @Enumerated(EnumType.STRING)
    private Gender gender;
    @Enumerated(EnumType.STRING)
    private UserStatus status;
    private String profileImageUrl;
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name ="user_roles", joinColumns = @JoinColumn(name="user_id"), inverseJoinColumns = @JoinColumn(name="role_id"))
    private Set<Role> roles;
}

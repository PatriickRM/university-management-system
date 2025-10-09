package com.university.domain.model;

import com.university.domain.model.enums.ProfessorStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;


@Entity
@Table(name = "professors")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Professor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_professor")
    private Long id;

    @OneToOne(optional = false, cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "id_user", nullable = false)
    private User user;

    @Column(unique = true, nullable = false)
    private String employeeCode;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    @Enumerated(EnumType.STRING)
    private EmploymentType employmentType;

    private LocalDate hireDate;

    private String officeLocation;

    private String specialization;

    @Enumerated(EnumType.STRING)
    private ProfessorStatus status;

    @OneToMany(mappedBy = "professor")
    private List<CourseOffering> courseOfferings;
}

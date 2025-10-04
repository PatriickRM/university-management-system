package com.university.domain.model;

import com.university.domain.model.enums.DepartmentStatus;
import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "departments")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_department")
    private Long id;

    @Column(nullable = false, unique = true)
    private String departmentCode;

    @Column(nullable = false)
    private String departmentName;

    @Column(length = 500)
    private String description;

    private String location; // Edificio/Piso

    private String phone;

    @Enumerated(EnumType.STRING)
    private DepartmentStatus status;

    // Relación con Career (un departamento tiene varias carreras)
    @OneToMany(mappedBy = "department")
    private List<Career> careers;

    // Relación con Professor (un departamento tiene varios profesores)
    @OneToMany(mappedBy = "department")
    private List<Professor> professors;
}

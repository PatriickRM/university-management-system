package com.university.domain.model;

import com.university.domain.model.enums.CareerStatus;
import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "careers")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Career {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id_career")
    private Long id;

    @Column(nullable = false, unique = true)
    private String careerCode;

    @Column(nullable = false)
    private String careerName;

    @Column(length = 500)
    private String description;

    private Integer durationSemesters;

    @Enumerated(EnumType.STRING)
    private CareerStatus status;

    // Relación con Department (una carrera pertenece a un departamento)
    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;
}

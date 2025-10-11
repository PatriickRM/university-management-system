package com.university.domain.model;

import com.university.domain.model.enums.PeriodStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "academic_periods")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AcademicPeriod {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_academic_period")
    private Long id;

    @Column(unique = true, nullable = false)
    private String periodCode;        // "2025-2"

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    private PeriodStatus status;

    @OneToMany(mappedBy = "academicPeriod")
    private List<CourseOffering> courseOfferings;
}

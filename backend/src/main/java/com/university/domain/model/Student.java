package com.university.domain.model;
import com.university.domain.model.enums.StudentStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "students")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_student")
    private Long id;

    @OneToOne(optional = false, cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "id_user", nullable = false)
    private User user;

    @Column(unique = true, nullable = false)
    private String studentCode;

    @ManyToOne
    @JoinColumn(name = "career_id")
    private Career career;

    private Integer currentSemester;

    private LocalDate admissionDate;

    private Integer totalCredits;

    private BigDecimal totalDebt;

    private String emergencyContactPhone;

    @Enumerated(EnumType.STRING)
    private StudentStatus academicStatus;

    @OneToMany(mappedBy = "student")
    private List<Enrollment> enrollments;
}

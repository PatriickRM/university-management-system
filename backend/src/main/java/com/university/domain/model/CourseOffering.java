package com.university.domain.model;

import com.university.domain.model.enums.OfferingStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "course_offerings")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CourseOffering {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_course_offering")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne
    @JoinColumn(name = "academic_period_id", nullable = false)
    private AcademicPeriod academicPeriod;

    @ManyToOne
    @JoinColumn(name = "professor_id")
    private Professor professor;

    @Column(nullable = false)
    private Integer maxStudents;

    private Integer currentEnrollment;

    @Enumerated(EnumType.STRING)
    private OfferingStatus status;

    @OneToMany(mappedBy = "courseOffering")
    private List<Enrollment> enrollments;
}
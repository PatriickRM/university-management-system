package com.university.domain.model;

import com.university.domain.model.enums.OfferingStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
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

    @Column(name = "duration_weeks")
    private Integer durationWeeks = 15; // 15 semanas

    @OneToMany(mappedBy = "courseOffering", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Enrollment> enrollments = new ArrayList<>();

    @OneToMany(mappedBy = "courseOffering", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<TimeSlot> timeSlots = new ArrayList<>();

    //Calcular total de horas semanales
    public Double getTotalWeeklyHours() {
        return timeSlots.stream()
                .mapToDouble(TimeSlot::getDurationHours)
                .sum();
    }
}
import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CourseOfferingService } from '../../../core/services/course-offering.service';
import { CourseService } from '../../../core/services/course.service';
import { ProfessorService } from '../../../core/services/professor.service';
import { AcademicPeriodService } from '../../../core/services/academic-period.service';
import { Course } from '../../../core/models/course.model';
import { Professor } from '../../../core/models/professor.model';
import { AcademicPeriod } from '../../../core/models/academic-period.model';
import { DayOfWeek } from '../../../core/models/timeslot.model';

@Component({
  selector: 'app-offering-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatStepperModule
  ],
  templateUrl: './offering-form-dialog.component.html',
  styleUrls: ['./offering-form-dialog.component.scss']
})
export class OfferingFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private offeringService = inject(CourseOfferingService);
  private courseService = inject(CourseService);
  private professorService = inject(ProfessorService);
  private periodService = inject(AcademicPeriodService);
  private snackBar = inject(MatSnackBar);

  basicInfoForm!: FormGroup;
  scheduleForm!: FormGroup;
  
  courses: Course[] = [];
  professors: Professor[] = [];
  periods: AcademicPeriod[] = [];
  
  loading = false;

  daysOfWeek = [
    { value: DayOfWeek.LUNES, label: 'Lunes' },
    { value: DayOfWeek.MARTES, label: 'Martes' },
    { value: DayOfWeek.MIERCOLES, label: 'Miércoles' },
    { value: DayOfWeek.JUEVES, label: 'Jueves' },
    { value: DayOfWeek.VIERNES, label: 'Viernes' },
    { value: DayOfWeek.SABADO, label: 'Sábado' }
  ];

  constructor(
    public dialogRef: MatDialogRef<OfferingFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.loadData();

    if (this.data && this.data.offering) {
        this.patchForm(this.data.offering);
    }
  }
  patchForm(offering: any): void {
    this.basicInfoForm.patchValue({
        courseId: offering.course.id,
        academicPeriodId: offering.academicPeriod.id,
        professorId: offering.professor.id,
        maxStudents: offering.maxStudents,
        durationWeeks: offering.durationWeeks
    });

    this.timeSlots.clear();
    offering.timeSlots.forEach((slot: any) => {
        this.timeSlots.push(
        this.fb.group({
            dayOfWeek: [slot.dayOfWeek, Validators.required],
            startTime: [slot.startTime, Validators.required],
            endTime: [slot.endTime, Validators.required],
            classroom: [slot.classroom, Validators.required]
        })
        );
    });
  }

  initForms(): void {
    this.basicInfoForm = this.fb.group({
      courseId: ['', Validators.required],
      academicPeriodId: ['', Validators.required],
      professorId: ['', Validators.required],
      maxStudents: [30, [Validators.required, Validators.min(1)]],
      durationWeeks: [15, [Validators.required, Validators.min(1)]]
    });

    this.scheduleForm = this.fb.group({
      timeSlots: this.fb.array([], Validators.required)
    });

    this.addTimeSlot();
  }
  
  get timeSlots(): FormArray {
    return this.scheduleForm.get('timeSlots') as FormArray;
  }

  createTimeSlot(): FormGroup {
    return this.fb.group({
      dayOfWeek: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      classroom: ['', Validators.required]
    });
  }

  get timeSlotGroups(): FormGroup[] {
    return this.timeSlots.controls as FormGroup[];
  }

  addTimeSlot(): void {
    if (this.timeSlots.length < 4) {
      this.timeSlots.push(this.createTimeSlot());
    }
  }

  removeTimeSlot(index: number): void {
    if (this.timeSlots.length > 1) {
      this.timeSlots.removeAt(index);
    }
  }

  loadData(): void {
    this.courseService.getAllCourses().subscribe({
      next: (courses) => this.courses = courses.filter(c => c.status === 'ACTIVO'),
      error: (err) => console.error(err)
    });

    this.professorService.getAllProfessors().subscribe({
      next: (professors) => this.professors = professors.filter(p => p.status === 'ACTIVO'),
      error: (err) => console.error(err)
    });

    this.periodService.getAllPeriods().subscribe({
      next: (periods) => this.periods = periods.filter(p => p.status === 'ACTIVO'),
      error: (err) => console.error(err)
    });
  }

  onSubmit(): void {
    if (this.basicInfoForm.invalid || this.scheduleForm.invalid) {
        this.basicInfoForm.markAllAsTouched();
        this.scheduleForm.markAllAsTouched();
        this.snackBar.open('Completa todos los campos', 'Cerrar', { duration: 3000 });
        return;
    }

    this.loading = true;

    const offeringData = {
        ...this.basicInfoForm.value,
        timeSlots: this.timeSlots.value
    };

    if (this.data?.offering) {
        //Editar
        this.offeringService.updateOffering(this.data.offering.id, offeringData).subscribe({
        next: () => {
            this.snackBar.open('Oferta actualizada', 'Cerrar', { duration: 3000 });
            this.dialogRef.close(true);
        },
        error: (err) => {
            this.loading = false;
            console.error(err);
            this.snackBar.open('Error al actualizar oferta', 'Cerrar', { duration: 3000 });
        }
        });
    } else {
        // Crear
        this.offeringService.createOffering(offeringData).subscribe({
        next: () => {
            this.snackBar.open('Oferta creada', 'Cerrar', { duration: 3000 });
            this.dialogRef.close(true);
        },
        error: (err) => {
            this.loading = false;
            console.error(err);
        }
        });
    }
  }


  close(): void {
    this.dialogRef.close();
  }
}
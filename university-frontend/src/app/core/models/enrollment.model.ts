export interface Enrollment {
  id: number;
  enrollmentDate: string;
  status: 'MATRICULADO' | 'EN_CURSO' | 'COMPLETADO' | 'RETIRADO' | 'APROBADO' | 'REPROBADO';
  finalGrade?: number;
  student: StudentBasic;
  courseOffering: CourseOfferingBasic;
}

export interface StudentBasic {
  id: number;
  studentCode: string;
  fullName: string;
  currentSemester: number;
}

export interface CourseOfferingBasic {
  id: number;
  courseCode: string;
  courseName: string;
  periodCode: string;
  professorName: string;
  availableSeats: number;
}

export interface EnrollmentCreateRequest {
  studentId: number;
  courseOfferingId: number;
}
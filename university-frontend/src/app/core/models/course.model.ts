export interface Course {
  id: number;
  courseCode: string;
  courseName: string;
  description: string;
  credits: number;
  status: 'ACTIVO' | 'INACTIVO';
  department: Department;
}

export interface Department {
  id: number;
  departmentCode: string;
  departmentName: string;
  location: string;
}

export interface CourseOffering {
  id: number;
  maxStudents: number;
  currentEnrollment: number;
  availableSeats: number;
  status: 'ABIERTO' | 'CERRADO' | 'CANCELADO' | 'EN_CURSO' | 'COMPLETADO';
  course: Course;
  academicPeriod: AcademicPeriod;
  professor: Professor;
}

export interface AcademicPeriod {
  id: number;
  periodCode: string;
  startDate: string;
  endDate: string;
  status: 'UPCOMING' | 'ACTIVE' | 'FINISHED';
}

export interface Professor {
  id: number;
  employeeCode: string;
  fullName: string;
  specialization: string;
}
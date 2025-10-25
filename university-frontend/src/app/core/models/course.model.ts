import { TimeSlotCreateRequest,TimeSlot } from './timeslot.model';

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
  durationWeeks: number;
  totalWeeklyHours: number;
  course: Course;
  academicPeriod: AcademicPeriod;
  professor: Professor;
  timeSlots: TimeSlot[];
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

export interface CourseCreateRequest {
  courseCode: string;
  courseName: string;
  description?: string;
  credits: number;
  departmentId: number;
  timeSlots?: TimeSlotCreateRequest[];
}

export interface CourseUpdateRequest {
  courseName?: string;
  description?: string;
  credits?: number;
  departmentId?: number;
  status?: 'ACTIVO' | 'INACTIVO';
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
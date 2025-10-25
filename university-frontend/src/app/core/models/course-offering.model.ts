import { Course, AcademicPeriod, Professor } from './course.model';
import { TimeSlot, TimeSlotCreateRequest } from './timeslot.model';

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

export interface CourseOfferingCreateRequest {
  courseId: number;
  academicPeriodId: number;
  professorId: number;
  maxStudents: number;
  durationWeeks?: number;
  timeSlots: TimeSlotCreateRequest[];
}

export interface CourseOfferingUpdateRequest {
  professorId?: number;
  maxStudents?: number;
  status?: 'ABIERTO' | 'CERRADO' | 'CANCELADO' | 'EN_CURSO' | 'COMPLETADO';
}

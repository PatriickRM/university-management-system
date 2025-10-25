export enum DayOfWeek {
  LUNES = 'LUNES',
  MARTES = 'MARTES',
  MIERCOLES = 'MIERCOLES',
  JUEVES = 'JUEVES',
  VIERNES = 'VIERNES',
  SABADO = 'SABADO'
}

export interface TimeSlot {
  id?: number;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;   
  classroom: string;
  durationHours?: number;
}

export interface TimeSlotCreateRequest {
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  classroom: string;
}

export interface Schedule {
  courseOfferingId: number;
  courseCode: string;
  courseName: string;
  professorName: string;
  credits: number;
  timeSlots: TimeSlot[];
  totalWeeklyHours: number;
}

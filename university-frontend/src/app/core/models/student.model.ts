import { User } from './user.model';

export interface Student {
  id: number;
  studentCode: string;
  currentSemester: number;
  admissionDate: string;
  totalCredits: number;
  totalDebt: number;
  emergencyContactPhone: string;
  academicStatus: 'ACTIVO' | 'INACTIVO' | 'GRADUADO' | 'RETIRADO';
  user: User;
  career: Career;
}

export interface Career {
  id: number;
  careerCode: string;
  careerName: string;
  durationSemesters: number;
}

export interface StudentCreateRequest {
  userInfo: {
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
    dateOfBirth: string;
    nationalId: string;
    gender: string;
  };
  studentCode: string;
  careerId: number;
  currentSemester: number;
  admissionDate: string;
  emergencyContactPhone: string;
}

export interface StudentUpdateRequest {
  careerId?: number;
  currentSemester?: number;
  totalCredits?: number;
  totalDebt?: number;
  emergencyContactPhone?: string;
  academicStatus?: 'ACTIVO' | 'INACTIVO' | 'GRADUADO' | 'RETIRADO';
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

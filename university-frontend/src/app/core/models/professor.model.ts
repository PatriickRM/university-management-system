import { User } from './user.model';

export interface Professor {
  id: number;
  employeeCode: string;
  employmentType: 'FULL_TIME' | 'PART_TIME';
  hireDate: string;
  officeLocation: string;
  specialization: string;
  status: 'ACTIVO' | 'INACTIVO' | 'RETIRADO';
  user: User;
  department: Department;
}

export interface Department {
  id: number;
  departmentCode: string;
  departmentName: string;
  description?: string;
  location: string;
  status?: 'ACTIVO' | 'INACTIVO';
}

export interface ProfessorCreateRequest {
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
  employeeCode: string;
  departmentId: number;
  employmentType: 'FULL_TIME' | 'PART_TIME';
  hireDate: string;
  officeLocation?: string;
  specialization?: string;
}

export interface ProfessorUpdateRequest {
  departmentId?: number;
  employmentType?: 'FULL_TIME' | 'PART_TIME';
  officeLocation?: string;
  specialization?: string;
  status?: 'ACTIVO' | 'INACTIVO' | 'RETIRADO';
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

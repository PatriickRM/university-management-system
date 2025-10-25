export interface User {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;
  nationalId: string;
  gender: 'MASCULINO' | 'FEMENINO' | 'OTRO';
  status: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';
  profileImageUrl?: string;
  roles: Role[];
}

export interface Role {
  id: number;
  name: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
  email: string;
  username: string;
  roles: Role[];
  student?: { id: number; studentCode: string };
}
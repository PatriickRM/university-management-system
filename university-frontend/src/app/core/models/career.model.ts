export interface Career {
  id: number;
  careerCode: string;
  careerName: string;
  description: string;
  durationSemesters: number;
  status: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';
  department: {
    id: number;
    departmentCode: string;
    departmentName: string;
    location: string;
  };
}
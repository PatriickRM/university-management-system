export interface AcademicPeriod {
  id: number;
  periodCode: string;
  startDate: string;
  endDate: string;
  status: 'NO_INICIADO' | 'ACTIVO' | 'FINALIZADO';
}

export interface AcademicPeriodCreateRequest {
  periodCode: string;
  startDate: string;
  endDate: string;
}

export interface AcademicPeriodUpdateRequest {
  startDate?: string;
  endDate?: string;
  status?: 'NO_INICIADO' | 'ACTIVO' | 'FINALIZADO';
}
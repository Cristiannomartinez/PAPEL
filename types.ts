
export enum ConsultationStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  DRAFT = 'DRAFT'
}

export interface Question {
  id: string;
  text: string;
  type: 'text' | 'radio' | 'checkbox';
  options?: string[];
}

export interface Consultation {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  status: ConsultationStatus;
  createdAt: string;
}

export interface Response {
  id: string;
  consultationId: string;
  workerName: string;
  workerId: string;
  answers: Record<string, any>;
  signature: string; // Base64 image
  timestamp: string;
}

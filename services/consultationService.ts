
import { Consultation, ConsultationStatus, Response } from '../types';

const STORAGE_KEY_CONSULTATIONS = 'consultworker_consultations';
const STORAGE_KEY_RESPONSES = 'consultworker_responses';

export const consultationService = {
  getConsultations: (): Consultation[] => {
    const stored = localStorage.getItem(STORAGE_KEY_CONSULTATIONS);
    if (!stored) {
      // Seed initial data
      const initial: Consultation[] = [
        {
          id: '1',
          title: 'Melhorias no Ambiente de Trabalho 2024',
          description: 'Esta consulta visa coletar sugestões para melhorias no refeitório e áreas de descanso.',
          status: ConsultationStatus.OPEN,
          createdAt: new Date().toISOString(),
          questions: [
            { id: 'q1', text: 'Como você avalia a limpeza atual?', type: 'radio', options: ['Excelente', 'Bom', 'Regular', 'Ruim'] },
            { id: 'q2', text: 'Quais equipamentos deveriam ser adicionados ao lazer?', type: 'checkbox', options: ['Ping Pong', 'TV', 'Puffs', 'Biblioteca'] },
            { id: 'q3', text: 'Algum comentário adicional?', type: 'text' }
          ]
        }
      ];
      localStorage.setItem(STORAGE_KEY_CONSULTATIONS, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(stored);
  },

  getResponses: (): Response[] => {
    const stored = localStorage.getItem(STORAGE_KEY_RESPONSES);
    return stored ? JSON.parse(stored) : [];
  },

  submitResponse: (response: Response): void => {
    const responses = consultationService.getResponses();
    responses.push(response);
    localStorage.setItem(STORAGE_KEY_RESPONSES, JSON.stringify(responses));
  }
};

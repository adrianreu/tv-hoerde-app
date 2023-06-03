import { api } from 'src/boot/axios';

export interface FeedbackRequest {
  firstname: string;
  lastname: string;
  email: string;
  message: string;
}

export async function createFeedback(feedback: FeedbackRequest): Promise<void> {
  await api.post('/api/feedbacks', {
    data: { data: feedback },
  });
}

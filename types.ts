
export type Category = 'all' | 'abs' | 'chest' | 'legs' | 'arms' | 'full';

export interface Exercise {
  id: string;
  name: string;
  category: Category;
  duration?: number; // in seconds
  reps?: number;
  emoji: string;
  description: string;
  intensity: 'easy' | 'medium' | 'hard';
}

export interface UserStats {
  streak: number;
  totalWorkouts: number;
  totalMinutes: number;
  history: { date: string; value: number }[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}


import { Exercise } from './types';

export const EXERCISES: Exercise[] = [
  { id: '1', name: "البلانك", category: "abs", duration: 30, emoji: "🧘", intensity: 'medium', description: 'تمرين أساسي لتقوية عضلات البطن والظهر.' },
  { id: '2', name: "السكوات", category: "legs", reps: 15, emoji: "🦵", intensity: 'easy', description: 'يستهدف عضلات الفخذين والمؤخرة.' },
  { id: '3', name: "الضغط", category: "chest", reps: 10, emoji: "💪", intensity: 'medium', description: 'تمرين كلاسيكي لعضلات الصدر والذراعين.' },
  { id: '4', name: "اللانجز", category: "legs", reps: 12, emoji: "🚶", intensity: 'medium', description: 'تمرين طعن لتقوية الساقين وتحسين التوازن.' },
  { id: '5', name: "الكرانش", category: "abs", reps: 20, emoji: "🔥", intensity: 'easy', description: 'تمرين يستهدف عضلات البطن العلوية.' },
  { id: '6', name: "البيربي", category: "full", duration: 45, emoji: "⚡", intensity: 'hard', description: 'تمرين شامل يحرق الكثير من السعرات الحرارية.' },
  { id: '7', name: "الترايسبس", category: "arms", reps: 12, emoji: "💥", intensity: 'medium', description: 'تمرين يستهدف العضلة ثلاثية الرؤوس.' },
  { id: '8', name: "رفع الرجلين", category: "abs", reps: 15, emoji: "🦶", intensity: 'medium', description: 'لتقوية عضلات البطن السفلية.' }
];

export const CATEGORY_LABELS: Record<string, string> = {
  all: 'الكل',
  abs: 'البطن',
  chest: 'الصدر',
  legs: 'الساقين',
  arms: 'الذراعين',
  full: 'كامل الجسم'
};

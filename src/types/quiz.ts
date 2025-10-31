
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct answer
  explanation?: string;
  topic: 'Constitution' | 'Criminal Law' | 'Civil Law' | 'Judiciary' | 'Rights';
}

export interface QuizState {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  selectedAnswers: (number | null)[];
  isQuizComplete: boolean;
}

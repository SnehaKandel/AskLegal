
import { getRandomQuestions } from '@/data/quizData';
import { QuizState, QuizQuestion } from '@/types/quiz';

export const quizService = {
  startNewQuiz(questionCount: number = 5): QuizState {
    const randomQuestions = getRandomQuestions(questionCount);
    
    return {
      questions: randomQuestions,
      currentQuestionIndex: 0,
      selectedAnswers: Array(randomQuestions.length).fill(null),
      isQuizComplete: false
    };
  },
  
  calculateScore(state: QuizState): number {
    let correctCount = 0;
    
    state.questions.forEach((question, index) => {
      if (state.selectedAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });
    
    return correctCount;
  }
};

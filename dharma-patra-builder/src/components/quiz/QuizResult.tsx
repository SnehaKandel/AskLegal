
import { Button } from "@/components/ui/button";
import { QuizState, QuizQuestion as QuizQuestionType } from "@/types/quiz";
import QuizQuestionComponent from "./QuizQuestion";
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

interface QuizResultProps {
  state: QuizState;
  score: number;
  onRetry: () => void;
  onGoHome: () => void;
}

const QuizResult = ({ state, score, onRetry, onGoHome }: QuizResultProps) => {
  const percentage = Math.round((score / state.questions.length) * 100);
  
  const getScoreEmoji = () => {
    if (percentage >= 80) return "🏆";
    if (percentage >= 60) return "🥈";
    return "📚";
  };
  
  const getScoreMessage = () => {
    if (percentage >= 80) return "🎉 Outstanding! You're a legal expert! 🎉";
    if (percentage >= 60) return "👍 Good job! Your legal knowledge is solid! 👍";
    return "💪 Great effort! Every quiz makes you stronger! 💪";
  };

  const triggerCelebrationConfetti = () => {
    if (percentage >= 80) {
      // Special celebration for high scores
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#9b87f5', '#7b68d5', '#b8a2ff']
      });
    }
  };

  useEffect(() => {
    triggerCelebrationConfetti();
  }, []);
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="text-6xl mb-4 animate-bounce">
          {getScoreEmoji()}
        </div>
        <h2 className="text-2xl font-bold text-asklegal-heading theme-transition mb-2">
          🎯 Quiz Results
        </h2>
        <div className="flex items-center justify-center space-x-2">
          <div className="text-3xl font-bold text-asklegal-purple">
            {score}/{state.questions.length}
          </div>
          <div className="text-lg text-asklegal-text/70 theme-transition">
            ({percentage}%)
          </div>
        </div>
        
        <div className="mt-4">
          <p className={`text-lg font-medium ${
            percentage >= 80 ? 'text-green-600 dark:text-green-400' :
            percentage >= 60 ? 'text-asklegal-purple' :
            'text-blue-600 dark:text-blue-400'
          }`}>
            {getScoreMessage()}
          </p>
        </div>

        {/* Achievement badges */}
        <div className="flex justify-center gap-2 mt-4">
          {percentage === 100 && (
            <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
              🌟 Perfect Score!
            </div>
          )}
          {percentage >= 80 && (
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              🎓 Legal Expert
            </div>
          )}
          {score > 0 && (
            <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              🎯 Quiz Completed
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-8 mb-6">
        <h3 className="text-xl font-medium text-asklegal-heading theme-transition">
          📋 Questions and Answers
        </h3>
        
        {state.questions.map((question, index) => (
          <div key={question.id} className="p-4 border border-asklegal-form-border/30 rounded-lg animate-fade-in hover:shadow-md transition-shadow">
            <div className="mb-2 text-sm text-asklegal-text/60 theme-transition flex items-center gap-2">
              <span>Question {index + 1} / {state.questions.length}</span>
              {state.selectedAnswers[index] === question.correctAnswer ? (
                <span className="text-green-500">✅ Correct</span>
              ) : (
                <span className="text-red-500">❌ Incorrect</span>
              )}
            </div>
            <QuizQuestionComponent 
              question={question}
              selectedOption={state.selectedAnswers[index]}
              onSelect={() => {}} // No action needed in results view
              showCorrectAnswer={true}
            />
          </div>
        ))}
      </div>
      
      <div className="flex justify-center space-x-4">
        <Button 
          onClick={onRetry} 
          variant="outline" 
          className="border-asklegal-purple text-asklegal-purple hover:scale-105 transition-transform"
        >
          🔄 Try Again
        </Button>
        <Button 
          onClick={onGoHome} 
          className="bg-asklegal-purple hover:bg-asklegal-purple/90 text-white hover:scale-105 transition-transform"
        >
          🏠 Go to Home Page
        </Button>
      </div>
    </div>
  );
};

export default QuizResult;

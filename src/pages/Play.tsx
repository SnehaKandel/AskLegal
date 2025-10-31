
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlayCircle, ArrowRight, BookOpen } from 'lucide-react';
import { QuizState } from '@/types/quiz';
import { quizService } from '@/services/quiz';
import QuizQuestion from '@/components/quiz/QuizQuestion';
import QuizResult from '@/components/quiz/QuizResult';

const Play = () => {
  const [quizState, setQuizState] = useState<QuizState | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();
  
  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Fire confetti from different positions
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };
  
  const startQuiz = () => {
    const newQuizState = quizService.startNewQuiz(5); // 5 questions
    setQuizState(newQuizState);
    setIsStarted(true);
  };
  
  const handleOptionSelect = (optionIndex: number) => {
    if (!quizState) return;
    
    // Create a new array to avoid modifying the existing one
    const updatedAnswers = [...quizState.selectedAnswers];
    updatedAnswers[quizState.currentQuestionIndex] = optionIndex;
    
    setQuizState({
      ...quizState,
      selectedAnswers: updatedAnswers
    });
  };
  
  const handleNextQuestion = () => {
    if (!quizState) return;
    
    // Start transition animation
    setIsTransitioning(true);
    
    // Use timeout to allow animation to complete
    setTimeout(() => {
      if (quizState.currentQuestionIndex < quizState.questions.length - 1) {
        // Reset selection and move to next question
        setQuizState({
          ...quizState,
          currentQuestionIndex: quizState.currentQuestionIndex + 1
        });
      } else {
        // Quiz finished - trigger confetti!
        const calculatedScore = quizService.calculateScore(quizState);
        setScore(calculatedScore);
        setQuizState({
          ...quizState,
          isQuizComplete: true
        });
        
        // Trigger confetti animation
        triggerConfetti();
      }
      // End transition animation
      setIsTransitioning(false);
    }, 300); // Animation duration
  };
  
  const handleRetry = () => {
    startQuiz();
  };
  
  const handleGoHome = () => {
    navigate('/');
  };
  
  const currentQuestion = quizState?.questions[quizState.currentQuestionIndex];
  const isLastQuestion = quizState ? quizState.currentQuestionIndex === quizState.questions.length - 1 : false;
  const isAnswerSelected = quizState ? quizState.selectedAnswers[quizState.currentQuestionIndex] !== null : false;
  
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          {!isStarted ? (
            <Card className="card-glassmorphism overflow-hidden animate-fade-in">
              <CardContent className="p-8">
                <div className="text-center">
                  <PlayCircle size={80} className="text-asklegal-purple mx-auto mb-6 animate-pulse" />
                  <h1 className="text-3xl font-bold text-asklegal-heading theme-transition mb-4">🎯 Legal Quiz Challenge</h1>
                  <p className="text-asklegal-text/70 theme-transition mb-8 max-w-lg mx-auto">
                    Test your knowledge of Nepal's constitution, criminal law, civil law, judiciary, and legal rights with our interactive quiz! Complete it to unlock awesome rewards!
                  </p>
                  
                  <div className="flex justify-center gap-4 flex-wrap">
                    <Button 
                      onClick={startQuiz}
                      className="bg-asklegal-purple hover:bg-asklegal-purple/90 text-white px-8 btn-animated hover:scale-105 transition-transform"
                    >
                      🚀 Start Quiz
                    </Button>
                    <Button 
                      onClick={() => navigate('/kanoon-search')}
                      variant="outline"
                      className="border-asklegal-purple/50 text-asklegal-text hover:bg-asklegal-purple/10 theme-transition"
                    >
                      <BookOpen size={18} className="mr-2" /> 📚 Study Laws
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : quizState && !quizState.isQuizComplete ? (
            <Card className={`card-glassmorphism overflow-hidden ${isTransitioning ? 'animate-fade-out' : 'animate-fade-in'}`}>
              <CardContent className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-asklegal-heading theme-transition">⚖️ Legal Quiz Challenge</h2>
                  <div className="text-asklegal-text/60 theme-transition">
                    Question {quizState.currentQuestionIndex + 1} / {quizState.questions.length}
                  </div>
                </div>
                
                {/* Enhanced Progress bar with emoji indicators */}
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full mb-6 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-asklegal-purple to-asklegal-accent rounded-full transition-all duration-300 relative"
                    style={{ width: `${((quizState.currentQuestionIndex + 1) / quizState.questions.length) * 100}%` }}
                  >
                    <div className="absolute right-0 top-0 h-full w-6 flex items-center justify-center">
                      🎯
                    </div>
                  </div>
                </div>
                
                {currentQuestion && !isTransitioning && (
                  <QuizQuestion 
                    question={currentQuestion}
                    selectedOption={quizState.selectedAnswers[quizState.currentQuestionIndex]}
                    onSelect={handleOptionSelect}
                    showCorrectAnswer={false}
                  />
                )}
                
                <div className="mt-8 flex justify-end">
                  <Button 
                    onClick={handleNextQuestion}
                    disabled={!isAnswerSelected}
                    className="bg-asklegal-purple hover:bg-asklegal-purple/90 text-white px-6 hover:scale-105 transition-transform"
                  >
                    {isLastQuestion ? '🎊 See Results' : 'Next Question'} 
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : quizState && quizState.isQuizComplete ? (
            <Card className="card-glassmorphism overflow-hidden animate-fade-in">
              <CardContent className="p-8">
                <QuizResult 
                  state={quizState}
                  score={score}
                  onRetry={handleRetry}
                  onGoHome={handleGoHome}
                />
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </MainLayout>
  );
};

export default Play;

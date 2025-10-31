
import { useState, useEffect } from "react";
import { QuizQuestion as QuestionType } from "@/types/quiz";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface QuizQuestionProps {
  question: QuestionType;
  selectedOption: number | null;
  onSelect: (index: number) => void;
  showCorrectAnswer?: boolean;
}

const QuizQuestion = ({ 
  question, 
  selectedOption, 
  onSelect,
  showCorrectAnswer = false
}: QuizQuestionProps) => {
  // Use local state that syncs with props to ensure clean reset between questions
  const [localSelectedOption, setLocalSelectedOption] = useState<number | null>(null);
  
  // Update local state when selectedOption prop changes or question changes
  useEffect(() => {
    setLocalSelectedOption(selectedOption);
  }, [selectedOption, question.id]); // Reset when question changes
  
  const handleOptionChange = (value: string) => {
    const optionIndex = parseInt(value);
    setLocalSelectedOption(optionIndex);
    onSelect(optionIndex);
  };
  
  return (
    <div className="space-y-4 animate-fade-in">
      <h3 className="text-xl font-medium text-asklegal-heading theme-transition mb-4">
        {question.question}
      </h3>
      
      <RadioGroup 
        value={localSelectedOption !== null ? localSelectedOption.toString() : undefined}
        onValueChange={handleOptionChange}
        className="space-y-3"
      >
        {question.options.map((option, index) => {
          const isCorrect = index === question.correctAnswer;
          const isSelected = localSelectedOption === index;
          
          let optionClassName = "rounded-lg p-4 transition-all duration-200 border";
          
          if (showCorrectAnswer) {
            if (isCorrect) {
              optionClassName += " bg-green-100 dark:bg-green-900/30 border-green-500";
            } else if (isSelected) {
              optionClassName += " bg-red-100 dark:bg-red-900/30 border-red-500";
            } else {
              optionClassName += " border-asklegal-form-border/30";
            }
          } else {
            optionClassName += isSelected 
              ? " border-asklegal-purple bg-asklegal-purple/10" 
              : " border-asklegal-form-border/30 hover:border-asklegal-purple/50";
          }
          
          return (
            <div key={`${question.id}-option-${index}`} className={optionClassName}>
              <div className="flex items-center gap-3">
                <RadioGroupItem 
                  value={index.toString()}
                  id={`option-${question.id}-${index}`}
                  className="text-asklegal-purple"
                  disabled={showCorrectAnswer}
                />
                <Label 
                  htmlFor={`option-${question.id}-${index}`}
                  className="font-normal text-base text-asklegal-text theme-transition w-full cursor-pointer"
                >
                  {option}
                </Label>
              </div>
            </div>
          );
        })}
      </RadioGroup>
      
      {showCorrectAnswer && question.explanation && (
        <div className="mt-4 p-4 bg-asklegal-purple/10 rounded-lg border border-asklegal-purple/20">
          <p className="text-asklegal-text theme-transition">
            <span className="font-medium">Explanation:</span> {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;


import { QuizQuestion } from "@/types/quiz";

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "What does Article 15 of Nepal's Constitution guarantee?",
    options: [
      "Right to equality",
      "Right to privacy",
      "Right to bear arms",
      "Freedom of expression"
    ],
    correctAnswer: 0, // Index 0 - Right to equality
    explanation: "Article 15 of Nepal's Constitution guarantees the right to equality for all citizens.",
    topic: "Constitution"
  },
  {
    id: "q2",
    question: "What is the term of office for the Chief Justice of the Supreme Court in Nepal?",
    options: [
      "3 years",
      "4 years",
      "5 years",
      "6 years"
    ],
    correctAnswer: 2, // Index 2 - 5 years
    explanation: "The term of office for the Chief Justice of Nepal's Supreme Court is 5 years.",
    topic: "Judiciary"
  },
  {
    id: "q3",
    question: "According to Nepal's criminal law, which of the following is a crime?",
    options: [
      "Breach of contract",
      "Property dispute",
      "Theft",
      "Property division"
    ],
    correctAnswer: 2, // Index 2 - Theft
    explanation: "Theft is a crime under criminal law, while the other options are related to civil law.",
    topic: "Criminal Law"
  },
  {
    id: "q4",
    question: "Under which law do divorce cases fall in Nepal?",
    options: [
      "Criminal law",
      "Civil law",
      "Constitutional law",
      "International law"
    ],
    correctAnswer: 1, // Index 1 - Civil law
    explanation: "Divorce cases fall under civil law in Nepal.",
    topic: "Civil Law"
  },
  {
    id: "q5",
    question: "How many fundamental rights are there in Nepal's Constitution?",
    options: [
      "27",
      "30",
      "31",
      "33"
    ],
    correctAnswer: 2, // Index 2 - 31
    explanation: "There are 31 fundamental rights in Nepal's Constitution.",
    topic: "Rights"
  },
  {
    id: "q6",
    question: "Which court is the highest in Nepal's judicial system?",
    options: [
      "District Court",
      "High Court",
      "Supreme Court",
      "Constitutional Bench"
    ],
    correctAnswer: 2, // Index 2 - Supreme Court
    explanation: "The Supreme Court is the highest court in Nepal's judicial system.",
    topic: "Judiciary"
  },
  {
    id: "q7",
    question: "According to Nepal's Constitution, the President and Vice President must be from:",
    options: [
      "The same political party",
      "Different political parties",
      "The President must be non-partisan",
      "There is no such provision"
    ],
    correctAnswer: 1, // Index 1 - Different political parties
    explanation: "According to Nepal's Constitution, the President and Vice President must be from different political parties, genders, or communities.",
    topic: "Constitution"
  },
  {
    id: "q8",
    question: "What is the maximum punishment for homicide in Nepal?",
    options: [
      "10 years imprisonment",
      "Life imprisonment",
      "Life imprisonment and confiscation of all property",
      "Death penalty"
    ],
    correctAnswer: 1, // Index 1 - Life imprisonment
    explanation: "The maximum punishment for homicide in Nepal is life imprisonment. There is no death penalty in Nepal.",
    topic: "Criminal Law"
  },
  {
    id: "q9",
    question: "How many schedules are there in Nepal's Constitution?",
    options: [
      "7",
      "8",
      "9",
      "10"
    ],
    correctAnswer: 2, // Index 2 - 9
    explanation: "There are 9 schedules in Nepal's Constitution.",
    topic: "Constitution"
  },
  {
    id: "q10",
    question: "What is the appeal period for civil cases in Nepal?",
    options: [
      "30 days",
      "35 days",
      "45 days",
      "70 days"
    ],
    correctAnswer: 2, // Index 2 - 45 days
    explanation: "In Nepal, civil case appeals must be filed within 45 days of the judgment date.",
    topic: "Civil Law"
  },
  {
    id: "q11",
    question: "Who has the authority to interpret the Constitution in Nepal?",
    options: [
      "Attorney General",
      "President",
      "Prime Minister",
      "Supreme Court"
    ],
    correctAnswer: 3, // Index 3 - Supreme Court
    explanation: "The authority to interpret the Constitution in Nepal is vested in the Supreme Court.",
    topic: "Constitution"
  },
  {
    id: "q12",
    question: "How many justices are there in Nepal's Supreme Court?",
    options: [
      "11",
      "15",
      "20",
      "25"
    ],
    correctAnswer: 1, // Index 1 - 15
    explanation: "Nepal's Supreme Court has up to 15 justices, including the Chief Justice.",
    topic: "Judiciary"
  }
];

// Function to get random questions
export const getRandomQuestions = (count: number = 5): QuizQuestion[] => {
  // Shuffle the array using Fisher-Yates algorithm
  const shuffled = [...quizQuestions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  // Return the first 'count' questions
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

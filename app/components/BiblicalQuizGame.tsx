import { useState } from "react";
import { Button } from "~/components/ui/button";
import useSound from "use-sound";
import TitleBar from "./TitleBar";
import questionsRaw from "../questions.json";
import shuffle from "lodash/shuffle";
// Define the structure of our questions
interface Question {
  question: string;
  answers: string[];
  correctAnswer: number;
}

const questions = shuffle(questionsRaw);

export function BiblicalQuizGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  // Sound effects
  const [playCorrect] = useSound("/audios/correct.mp3");
  const [playIncorrect] = useSound("/audios/incorrect.mp3");

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowCorrectAnswer(true);

    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
      playCorrect();
    } else {
      playIncorrect();
    }
  };

  const goToNextQuestion = () => {
    setSelectedAnswer(null);
    setShowCorrectAnswer(false);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const restartGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setShowCorrectAnswer(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <TitleBar />
      <div className="flex-grow flex flex-col items-center justify-center p-4">
        {showResult ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
            <p className="text-xl mb-4">
              Your score: {score} out of {questions.length}
            </p>
            <Button onClick={restartGame}>Jogue de novo</Button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">
              {questions[currentQuestion].question}
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {questions[currentQuestion].answers.map((answer, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={`w-48 h-16 text-lg ${
                    selectedAnswer !== null
                      ? index === questions[currentQuestion].correctAnswer
                        ? "bg-green-500 hover:bg-green-600"
                        : selectedAnswer === index
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-blue-500 hover:bg-blue-600"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                  disabled={selectedAnswer !== null}
                >
                  {answer}
                </Button>
              ))}
            </div>
            {showCorrectAnswer && (
              <div className="mb-4 text-center">
                <p className="text-lg font-semibold">
                  {selectedAnswer === questions[currentQuestion].correctAnswer
                    ? "Correto!"
                    : `Incorreto. A resposta correta é: ${
                        questions[currentQuestion].answers[
                          questions[currentQuestion].correctAnswer
                        ]
                      }`}
                </p>
              </div>
            )}
            {selectedAnswer !== null && (
              <Button onClick={goToNextQuestion} className="mt-4">
                {currentQuestion < questions.length - 1
                  ? "Próxima pergunta"
                  : "Ver Resultados"}
              </Button>
            )}
            <p className="mt-4 text-lg">
              Pergunta {currentQuestion + 1} de {questions.length}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

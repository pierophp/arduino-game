import { useCallback, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import useSound from "use-sound";
import { TitleBar } from "./TitleBar";
import questionsRaw from "../questions.json";
import shuffle from "lodash/shuffle";
import { useSpeech } from "~/hooks/useSpeech";
import {
  VolumeIcon as VolumeUp,
  Play,
  Baby,
  User,
  ScanFace,
  ArrowRight,
} from "lucide-react";

type Question = {
  question: string;
  answers: string[];
  correctAnswer: number;
};

function shuffleQuestions(qs: Question[]) {
  const questions = shuffle(qs);
  questions.map((q) => {
    const correctAnswer = q.answers[q.correctAnswer];
    q.answers = shuffle(q.answers);
    q.correctAnswer = q.answers.findIndex((a) => a === correctAnswer);
    return q;
  });

  return questions;
}

const questions = shuffleQuestions(questionsRaw);

export function BiblicalQuizGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const [playCorrect] = useSound("/audios/correct.mp3");
  const [playIncorrect] = useSound("/audios/incorrect.mp3");

  const { speak, speakSequence, speaking, supported, setVoice } = useSpeech();

  const readQuestionAndOptions = useCallback(() => {
    if (supported && !showResult) {
      const textsToSpeak = [
        questions[currentQuestion].question,
        ...questions[currentQuestion].answers.map(
          (answer, index) => `Opção ${index + 1}: ${answer}`
        ),
      ];
      speakSequence(textsToSpeak, 50);
    }
  }, [currentQuestion, showResult, speakSequence, supported]);

  useEffect(() => {
    if (gameStarted) {
      readQuestionAndOptions();
    }
  }, [currentQuestion, gameStarted, readQuestionAndOptions]);

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowCorrectAnswer(true);

    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
      playCorrect();
      speak("Correto!");
    } else {
      playIncorrect();
      speak(
        `Incorreto. A resposta correta é ${
          questions[currentQuestion].answers[
            questions[currentQuestion].correctAnswer
          ]
        }`
      );
    }
  };

  const goToNextQuestion = (level: 1 | 2 | 3) => {
    setSelectedAnswer(null);
    setShowCorrectAnswer(false);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
      speak(
        `Questionário concluído! Sua pontuação é ${score} de ${questions.length}`
      );
    }
  };

  const startGame = () => {
    setGameStarted(true);
  };

  const restartGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setShowCorrectAnswer(false);
    setGameStarted(false);
  };

  const handleVoiceChange = (voice: SpeechSynthesisVoice) => {
    setVoice(voice);
  };

  if (!gameStarted) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <TitleBar onVoiceChange={handleVoiceChange} />
        <div className="flex-grow flex flex-col items-center justify-center p-4">
          <h2 className="text-2xl font-bold mb-4">
            Bem-vindo ao Torta na Cara Bíblico!
          </h2>
          <Button onClick={startGame} className="mt-4">
            <Play className="w-4 h-4" /> Iniciar Jogo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <TitleBar onVoiceChange={handleVoiceChange} />
      <div className="flex-grow flex flex-col items-center justify-center p-4">
        {showResult ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Questionário Concluído!</h2>
            <p className="text-xl mb-4">
              Sua pontuação: {score} de {questions.length}
            </p>
            <Button onClick={restartGame}>Jogar Novamente</Button>
          </div>
        ) : (
          <>
            <div className="w-full max-w-2xl mb-6 text-center">
              <h2 className="text-2xl font-bold mb-2">
                {questions[currentQuestion].question}
              </h2>
              <Button
                onClick={readQuestionAndOptions}
                disabled={speaking}
                aria-label="Ouvir a pergunta e opções novamente"
                className="mt-2"
              >
                <VolumeUp className="w-6 h-6 mr-2" />
                <span>Ouvir Novamente</span>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {questions[currentQuestion].answers.map((answer, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={`w-full h-16 text-lg ${
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
                  <span className="mr-2 font-bold">{index + 1}.</span> {answer}
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
              <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                <h3 className="text-xl font-semibold mb-4 text-center border-b pb-2 flex items-center justify-center gap-2">
                  <span>Próxima Pergunta</span>
                  <ArrowRight className="w-5 h-5" />
                </h3>
                <div className="flex gap-4">
                  <Button
                    onClick={() => goToNextQuestion(1)}
                    className="flex-1 items-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-700"
                  >
                    <Baby className="w-5 h-5" />
                    Criança
                  </Button>
                  <Button
                    onClick={() => goToNextQuestion(2)}
                    className="flex-1 items-center gap-2 bg-lime-600 hover:bg-lime-700"
                  >
                    <ScanFace className="w-5 h-5" />
                    Jovem
                  </Button>
                  <Button
                    onClick={() => goToNextQuestion(3)}
                    className="flex-1 items-center gap-2 bg-sky-600 hover:bg-sky-700"
                  >
                    <User className="w-5 h-5" />
                    Adulto
                  </Button>
                </div>
              </div>
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

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
import { useCommandContext } from "~/providers/CommandProvider";
import { AiSpeaking } from "./AiSpeaking.client";

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
  const { sendCommand } = useCommandContext();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isProcessingAnswer, setIsProcessingAnswer] = useState(false);

  const [playCorrect] = useSound("/audios/correct.mp3");
  const [playIncorrect] = useSound("/audios/incorrect.mp3");

  const { speak, speakSequence, speaking, supported, setVoice, setSpeed } =
    useSpeech();

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

  const handleAnswer = async (answerIndex: number) => {
    setIsProcessingAnswer(true);
    setSelectedAnswer(answerIndex);

    await new Promise((resolve) => setTimeout(resolve, 500));

    await speak(
      `Você escolheu ${questions[currentQuestion].answers[answerIndex]}. Será que está correta?`,
      true
    );

    await new Promise((resolve) => setTimeout(resolve, 500));

    setShowCorrectAnswer(true);
    setIsProcessingAnswer(false);

    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
      playCorrect();
      speak("Correto!");
      await sendCommand("1");
    } else {
      playIncorrect();
      speak(
        `Incorreta. A resposta correta é ${
          questions[currentQuestion].answers[
            questions[currentQuestion].correctAnswer
          ]
        }`
      );
      await sendCommand("2");
    }
  };

  const goToNextQuestion = async (level: 1 | 2 | 3) => {
    setSelectedAnswer(null);
    setShowCorrectAnswer(false);
    await sendCommand("0");

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

  const handleSpeedChange = (speed: number) => {
    setSpeed(speed);
  };

  if (!gameStarted) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <TitleBar
          onVoiceChange={handleVoiceChange}
          onSpeedChange={handleSpeedChange}
        />
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
      <TitleBar
        onVoiceChange={handleVoiceChange}
        onSpeedChange={handleSpeedChange}
      />

      <AiSpeaking speaking={speaking} />

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
                disabled={speaking || selectedAnswer !== null}
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
                    isProcessingAnswer && selectedAnswer === index
                      ? "bg-amber-500 hover:bg-amber-600 pulse"
                      : selectedAnswer !== null
                      ? !isProcessingAnswer &&
                        index === questions[currentQuestion].correctAnswer
                        ? "bg-green-600 hover:bg-green-700"
                        : !isProcessingAnswer && selectedAnswer === index
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-blue-600 hover:bg-blue-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  disabled={selectedAnswer !== null || isProcessingAnswer}
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
            {selectedAnswer !== null && !isProcessingAnswer && (
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

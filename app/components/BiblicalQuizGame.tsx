import shuffle from "lodash/shuffle";
import { ArrowRight, VolumeIcon as VolumeUp } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import useSound from "use-sound";
import { Button } from "~/components/ui/button";
import { useSpeech } from "~/hooks/useSpeech";
import { useCommandContext } from "~/providers/CommandProvider";
import questionsRaw from "../questions.json";
import { AiSpeaking } from "./AiSpeaking.client";
import { AdultButton } from "./buttons/AdultButton";
import { ChildButton } from "./buttons/ChildButton";
import { CircuitOverseerButton } from "./buttons/CircuitOverseerButton";
import { TeenButton } from "./buttons/TeenButton";
import { TitleBar } from "./TitleBar";

type Level = 1 | 2 | 3 | 4;

type Question = {
  id: number;
  question: string;
  answers: string[];
  correctAnswer: number;
  level: Level;
};

const rightAnswerPhrases = [
  "Correto!",
  "Parabéns!",
  "Muito bem!",
  "Excelente!",
  "Você está fazendo muito progrresso!",
  "Você acertou em cheio!",
  "Ótimo trabalho, continue assim!",
  "Você está arrasando!",
  "Incrível!",
  "Muito bom, você está se saindo muito bem!",
  "Você está indo muito bem!",
  "Impressionante!",
  "Show de bola!",
  "Continue assim!",
  "Você fez isso parecer fácil!",
  "Isso mesmo!",
  "Acertou! Acho que você andou estudando com Salomão.",
  "Incrível! Davi não acertava tão bem nem com a funda.",
  "Parabéns! Você desvendou mais um mistério bíblico!",
  "Resposta certa! Você deve estar prestando atenção na reunião!",
  "Resposta certa! Você deve estar lendo a bíblia todo dia!",
];

const wrongAnswerPhrases = [
  "Incorreto! Continue estudando!",
  "Incorreto! Não desista!",
  "Boa tentativa!",
  "Tente mais uma vez.",
  "Foi por pouco!",
  "Está quase! Continue firme!",
  "Não foi dessa vez, mas você vai chegar lá!",
  "Tente novamente, você está quase lá!",
  "Vai ser na próxima! Não desanime!",
  "Erro é parte do aprendizado. Vamos tentar mais uma?",
];

const seeAnswerPhrases = [
  "Será que está correta?",
  "Vamos ver se está certa?",
  "Vamos descobrir se você acertou!",
  "Agora é hora de revelar a resposta!",
  "Curioso para saber se está certo?",
  "Vamos conferir se sua resposta está correta!",
  "Hora da verdade, veja se você acertou!",
  "Vamos ver se você mandou bem!",
  "Chegou o momento da verdade!",
  "Está na hora de descobrir sua resposta!",
  "Vamos ver se você está mandando bem!",
  "Será que você acertou? Vamos conferir!",
  "Hora de saber se você está no caminho certo!",
  "Vamos descobrir se sua resposta é tão certeira quanto a funda de Davi!",
];

const youChoosePhrases = ["Você escolheu", "Sua resposta foi"];

const SHOWN_QUESTIONS_KEY = "shownQuestions";

interface ShownQuestions {
  [level: number]: number[];
}

function getShownQuestions(): ShownQuestions {
  const stored = localStorage.getItem(SHOWN_QUESTIONS_KEY);
  return stored ? JSON.parse(stored) : { 1: [], 2: [], 3: [], 4: [] };
}

function addShownQuestion(level: number, questionId: number) {
  const shown = getShownQuestions();
  shown[level] = [...(shown[level] || []), questionId];
  localStorage.setItem(SHOWN_QUESTIONS_KEY, JSON.stringify(shown));
}

function resetShownQuestions(level: Level) {
  const shown = getShownQuestions();
  shown[level] = [];
  localStorage.setItem(SHOWN_QUESTIONS_KEY, JSON.stringify(shown));
}

function getAvailableQuestions(
  level: number,
  allQuestions: Question[]
): Question[] {
  const shown = getShownQuestions();
  const shownIds = shown[level] || [];
  return allQuestions.filter(
    (q) => q.level === level && !shownIds.includes(q.id)
  );
}

function shuffleQuestions(qs: any[]): Question[] {
  qs.map((q, index) => {
    q.id = index;
  });

  const questions = shuffle(qs);
  questions.map((q, index) => {
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
  const [playDrumRoll] = useSound("/audios/drum_roll.mp3");

  const { speak, speakSequence, speaking, supported, setVoice, setSpeed } =
    useSpeech();

  const readQuestionAndOptions = useCallback(
    (cq: number) => {
      if (!supported) {
        return;
      }

      const textsToSpeak = [
        questions[cq].question,
        ...questions[cq].answers.map(
          (answer, index) => `Opção ${index + 1}: ${answer}`
        ),
      ];

      speakSequence(textsToSpeak, 0);
    },
    [speakSequence, supported]
  );

  const handleAnswer = async (answerIndex: number) => {
    setIsProcessingAnswer(true);
    setSelectedAnswer(answerIndex);

    addShownQuestion(
      questions[currentQuestion].level,
      questions[currentQuestion].id
    );

    const randomSeePhrase =
      seeAnswerPhrases[Math.floor(Math.random() * seeAnswerPhrases.length)];

    const randomYouChoosePhrase =
      youChoosePhrases[Math.floor(Math.random() * youChoosePhrases.length)];

    await speak(
      `${randomYouChoosePhrase} ${questions[currentQuestion].answers[answerIndex]}. ${randomSeePhrase}`,
      true
    );

    playDrumRoll();

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setShowCorrectAnswer(true);
    setIsProcessingAnswer(false);

    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
      playCorrect();
      await sendCommand("1");

      const randomRightPhrase =
        rightAnswerPhrases[
          Math.floor(Math.random() * rightAnswerPhrases.length)
        ];

      await speak(randomRightPhrase);
    } else {
      playIncorrect();

      await sendCommand("2");

      const randomWrongPhrase =
        wrongAnswerPhrases[
          Math.floor(Math.random() * wrongAnswerPhrases.length)
        ];

      await speak(
        `${randomWrongPhrase} A resposta correta é ${
          questions[currentQuestion].answers[
            questions[currentQuestion].correctAnswer
          ]
        }`
      );
    }
  };

  const goToNextQuestion = async (level: Level) => {
    setSelectedAnswer(null);
    setShowCorrectAnswer(false);
    await sendCommand("0");

    const availableQuestions = getAvailableQuestions(level, questions);

    if (availableQuestions.length === 0) {
      const shown = getShownQuestions();
      shown[level] = [];
      localStorage.setItem(SHOWN_QUESTIONS_KEY, JSON.stringify(shown));

      const newAvailableQuestions = getAvailableQuestions(level, questions);

      if (newAvailableQuestions.length === 0) {
        setShowResult(true);
        await speak(`Não há mais perguntas disponíveis para este nível`);
        return;
      }
    }

    const nextQuestion =
      availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    const nextQuestionIndex = questions.findIndex(
      (q) => q.id === nextQuestion.id
    );

    if (nextQuestionIndex !== -1) {
      setCurrentQuestion(nextQuestionIndex);
      readQuestionAndOptions(nextQuestionIndex);
    } else {
      setShowResult(true);
      await speak(`A pontuação foi ${score} de ${questions.length}`);
    }
  };

  const startGame = (level: Level) => {
    setGameStarted(true);
    goToNextQuestion(level);
  };

  const restartGame = (level: Level) => {
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setShowCorrectAnswer(false);
    resetShownQuestions(level);
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
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-center border-b pb-2 flex items-center justify-center gap-2">
              <span>Iniciar Jogo</span>
            </h3>
            <div className="grid grid-cols-2 gap-4 w-[340px]">
              <ChildButton onClick={() => startGame(1)} />
              <TeenButton onClick={() => startGame(2)} />
              <AdultButton onClick={() => startGame(3)} />
              <CircuitOverseerButton onClick={() => startGame(4)} />
            </div>
          </div>
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
            <Button
              onClick={() => restartGame(questions[currentQuestion].level)}
            >
              Jogar Novamente
            </Button>
          </div>
        ) : (
          <>
            <div className="w-full max-w-2xl mb-6 text-center">
              <h2 className="text-2xl font-bold mb-2">
                {questions[currentQuestion].question}
              </h2>
              <Button
                onClick={() => readQuestionAndOptions(currentQuestion)}
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
                  className={`w-full h-12 text-lg text-left ${
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
                <div className="grid grid-cols-2 gap-4 w-[600px]">
                  <ChildButton onClick={() => goToNextQuestion(1)} />
                  <TeenButton onClick={() => goToNextQuestion(2)} />
                  <AdultButton onClick={() => goToNextQuestion(3)} />
                  <CircuitOverseerButton onClick={() => goToNextQuestion(4)} />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

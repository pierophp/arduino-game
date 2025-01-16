import { useState, useEffect, useCallback } from "react";

export function useSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);
  const [speed, setSpeed] = useState<number>(() => {
    if (typeof window !== "undefined") {
      return parseFloat(localStorage.getItem("speechSpeed") || "1.2");
    }
    return 1;
  });

  useEffect(() => {
    if (typeof window !== "undefined" && !("speechSynthesis" in window)) {
      setSupported(false);
    }
  }, []);

  if (typeof window !== "undefined") {
    window.speechSynthesis.onvoiceschanged = function () {
      const voices = window.speechSynthesis.getVoices();
      const savedVoiceName = localStorage.getItem("selectedVoice");
      const voice = voices.find((voice) => voice.name === savedVoiceName);
      if (voice) {
        setSelectedVoice(voice);
        const warmUp = new SpeechSynthesisUtterance("");
        warmUp.voice = voice;
        speechSynthesis.speak(warmUp);
      }
    };
  }

  const speak = useCallback(
    (text: string, waitForCompletion: boolean = false): Promise<void> => {
      if (!supported) return Promise.resolve();

      return new Promise((resolve) => {
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
        utterance.lang = "pt-BR";
        utterance.rate = speed;
        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => {
          setSpeaking(false);
          resolve();
        };

        window.speechSynthesis.speak(utterance);

        if (!waitForCompletion) {
          resolve();
        }
      });
    },
    [supported, selectedVoice, speed]
  );

  const speakSequence = useCallback(
    async (texts: string[], pauseDuration: number = 300) => {
      if (!supported) return;
      setSpeaking(true);
      window.speechSynthesis.cancel();

      for (let i = 0; i < texts.length; i++) {
        await speak(texts[i], true);
        if (i < texts.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, pauseDuration));
        }
      }

      setSpeaking(false);
    },
    [supported, speak]
  );

  const setVoice = useCallback((voice: SpeechSynthesisVoice) => {
    setSelectedVoice(voice);
  }, []);

  // Add a function to control the speed
  const setSpeechSpeed = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
  }, []);

  return {
    speak,
    speakSequence,
    speaking,
    supported,
    setVoice,
    setSpeed,
    setSpeechSpeed,
  };
}

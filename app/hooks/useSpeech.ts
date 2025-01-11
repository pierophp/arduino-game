"use client";

import { useState, useEffect, useCallback } from "react";

export function useSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);
  const [speed, setSpeed] = useState(1.2);

  useEffect(() => {
    if (typeof window !== "undefined" && !("speechSynthesis" in window)) {
      setSupported(false);
    }
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!supported) return;

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      utterance.lang = "pt-BR";
      utterance.rate = speed; // Set the speed of speech here
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
    },
    [supported, selectedVoice, speed] // Add speed as a dependency
  );

  const speakSequence = useCallback(
    (texts: string[], pauseDuration: number = 300) => {
      if (!supported) return;

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      let index = 0;
      const speakNext = () => {
        if (index < texts.length) {
          const utterance = new SpeechSynthesisUtterance(texts[index]);
          if (selectedVoice) {
            utterance.voice = selectedVoice;
          }
          utterance.lang = "pt-BR";
          utterance.rate = speed; // Set the speed of speech here
          utterance.onstart = () => setSpeaking(true);
          utterance.onend = () => {
            setSpeaking(false);
            setTimeout(() => {
              index++;
              speakNext();
            }, pauseDuration);
          };
          window.speechSynthesis.speak(utterance);
        }
      };
      speakNext();
    },
    [supported, selectedVoice, speed] // Add speed as a dependency
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
    setSpeechSpeed,
  };
}

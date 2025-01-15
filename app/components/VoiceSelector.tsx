import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

interface VoiceSelectorProps {
  onVoiceChange: (voice: SpeechSynthesisVoice) => void;
  onSpeedChange: (speed: number) => void;
  defaultSpeed?: number;
}

export function VoiceSelector({
  onVoiceChange,
  onSpeedChange,
  defaultSpeed = 1.2,
}: VoiceSelectorProps) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedVoice") || "";
    }
    return "";
  });
  const [speed, setSpeed] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("speechSpeed") || defaultSpeed.toString();
    }
    return defaultSpeed.toString();
  });

  useEffect(() => {
    function loadVoices() {
      const availableVoices = window.speechSynthesis.getVoices();
      const portugueseVoices = availableVoices.filter((voice) =>
        voice.lang.startsWith("pt")
      );
      setVoices(portugueseVoices);

      const savedVoice = localStorage.getItem("selectedVoice");
      if (savedVoice) {
        const voice = portugueseVoices.find((v) => v.name === savedVoice);
        if (voice) {
          onVoiceChange(voice);
        }
      }
    }

    loadVoices();
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [onVoiceChange]);

  const handleVoiceChange = (voiceName: string) => {
    const selectedVoice = voices.find((voice) => voice.name === voiceName);
    if (selectedVoice) {
      localStorage.setItem("selectedVoice", voiceName);
      setSelectedVoice(voiceName);
      onVoiceChange(selectedVoice);
    }
  };

  const handleSpeedChange = (value: string) => {
    const speedValue = parseFloat(value);
    localStorage.setItem("speechSpeed", value);
    setSpeed(value);
    onSpeedChange(speedValue);
  };

  if (voices.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <Select onValueChange={handleVoiceChange} value={selectedVoice}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Selecionar voz" />
        </SelectTrigger>
        <SelectContent>
          {voices.map((voice) => (
            <SelectItem key={voice.name} value={voice.name}>
              {voice.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={handleSpeedChange} value={speed}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Velocidade" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">1x (Normal)</SelectItem>
          <SelectItem value="1.1">1.1x</SelectItem>
          <SelectItem value="1.2">1.2x</SelectItem>
          <SelectItem value="1.3">1.3x</SelectItem>
          <SelectItem value="1.4">1.4x</SelectItem>
          <SelectItem value="1.5">1.5x</SelectItem>
          <SelectItem value="1.6">1.6x</SelectItem>
          <SelectItem value="1.7">1.7x</SelectItem>
          <SelectItem value="1.8">1.8x</SelectItem>
          <SelectItem value="1.9">1.9x</SelectItem>
          <SelectItem value="2">2x</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

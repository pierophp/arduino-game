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
}

export function VoiceSelector({ onVoiceChange }: VoiceSelectorProps) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedVoice") || "";
    }
    return "";
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

  if (voices.length === 0) {
    return null;
  }

  return (
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
  );
}

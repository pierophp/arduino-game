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

  useEffect(() => {
    function loadVoices() {
      const availableVoices = window.speechSynthesis.getVoices();
      const portugueseVoices = availableVoices.filter((voice) =>
        voice.lang.startsWith("pt")
      );
      setVoices(portugueseVoices);
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
  }, []);

  const handleVoiceChange = (voiceName: string) => {
    const selectedVoice = voices.find((voice) => voice.name === voiceName);
    if (selectedVoice) {
      onVoiceChange(selectedVoice);
    }
  };

  if (voices.length === 0) {
    return null;
  }

  return (
    <Select onValueChange={handleVoiceChange}>
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

import { VoiceSelector } from "./VoiceSelector";

interface TitleBarProps {
  onVoiceChange: (voice: SpeechSynthesisVoice) => void;
}

export function TitleBar({ onVoiceChange }: TitleBarProps) {
  return (
    <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-3xl font-bold">Torta na Cara Bíblico</h1>
      <VoiceSelector onVoiceChange={onVoiceChange} />
    </div>
  );
}

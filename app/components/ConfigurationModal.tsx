import { Settings } from "lucide-react";
import { useState } from "react";
import { VoiceSelector } from "./VoiceSelector";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface ConfigurationModalProps {
  onVoiceChange: (voice: SpeechSynthesisVoice) => void;
  onSpeedChange: (speed: number) => void;
}

export function ConfigurationModal({
  onVoiceChange,
  onSpeedChange,
}: ConfigurationModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configurações</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <h3 className="text-sm font-medium mb-2">Configurações de Voz</h3>
          <VoiceSelector
            onVoiceChange={onVoiceChange}
            onSpeedChange={onSpeedChange}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

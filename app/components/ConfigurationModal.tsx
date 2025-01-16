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
import { useCommandContext } from "~/providers/CommandProvider";

interface ConfigurationModalProps {
  onVoiceChange: (voice: SpeechSynthesisVoice) => void;
  onSpeedChange: (speed: number) => void;
}

export function ConfigurationModal({
  onVoiceChange,
  onSpeedChange,
}: ConfigurationModalProps) {
  const [open, setOpen] = useState(false);
  const { sendCommand } = useCommandContext();

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

        <div className="py-4 border-t">
          <h3 className="text-sm font-medium mb-2">Testar Arduino</h3>
          <div className="flex flex-col gap-2">
            <Button variant={"default"} onClick={() => sendCommand("1")}>
              Resposta Certa
            </Button>
            <Button variant={"destructive"} onClick={() => sendCommand("2")}>
              Resposta Errada
            </Button>
            <Button variant={"outline"} onClick={() => sendCommand("0")}>
              Próxima Pergunta
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

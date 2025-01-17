import { Button } from "./ui/button";
import { Bluetooth, Usb } from "lucide-react";
import { useCommandContext } from "~/providers/CommandProvider";
import { ConfigurationModal } from "./ConfigurationModal";

interface TitleBarProps {
  onVoiceChange: (voice: SpeechSynthesisVoice) => void;
  onSpeedChange: (speed: number) => void;
}

export function TitleBar({ onVoiceChange, onSpeedChange }: TitleBarProps) {
  const { connectionType, connectBluetooth, connectUSB } = useCommandContext();

  return (
    <div className="bg-purple-900 text-white p-4 flex justify-between items-center">
      <h1 className="text-3xl font-bold">Torta na Cara Bíblico</h1>
      <div className="flex items-center gap-4">
        <Button
          variant="secondary"
          onClick={connectBluetooth}
          className={
            connectionType === "bluetooth"
              ? "bg-green-500 hover:bg-green-600"
              : ""
          }
        >
          <Bluetooth className="w-4 h-4 mr-2" />
          {connectionType === "bluetooth" ? "Conectado" : "Conectar"}
        </Button>

        <Button
          variant="secondary"
          onClick={connectUSB}
          className={
            connectionType === "usb" ? "bg-green-500 hover:bg-green-600" : ""
          }
        >
          <Usb className="w-4 h-4 mr-2" />
          {connectionType === "usb" ? "Conectado" : "Conectar"}
        </Button>

        <ConfigurationModal
          onVoiceChange={onVoiceChange}
          onSpeedChange={onSpeedChange}
        />
      </div>
    </div>
  );
}

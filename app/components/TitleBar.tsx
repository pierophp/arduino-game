import { VoiceSelector } from "./VoiceSelector";
import { Button } from "./ui/button";
import { Bluetooth, Send, Usb } from "lucide-react";
import { useCommandContext } from "~/providers/CommandProvider";

interface TitleBarProps {
  onVoiceChange: (voice: SpeechSynthesisVoice) => void;
  onSpeedChange: (speed: number) => void;
}

export function TitleBar({ onVoiceChange, onSpeedChange }: TitleBarProps) {
  const { connectionType, connectBluetooth, connectUSB, sendCommand } =
    useCommandContext();

  const handleSendCommand = async (command: string) => {
    const success = await sendCommand(command);
    if (success) {
      console.log(`Sent command: ${command}`);
    }
  };

  return (
    <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
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

        <VoiceSelector
          onVoiceChange={onVoiceChange}
          onSpeedChange={onSpeedChange}
        />
      </div>
    </div>
  );
}

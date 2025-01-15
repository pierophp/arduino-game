import { VoiceSelector } from "./VoiceSelector";
import { Button } from "./ui/button";
import { useBluetooth } from "~/hooks/useBluetooth";
import { Bluetooth, Send } from "lucide-react";

interface TitleBarProps {
  onVoiceChange: (voice: SpeechSynthesisVoice) => void;
}

export function TitleBar({ onVoiceChange }: TitleBarProps) {
  const { connected, connect, sendCommand } = useBluetooth();

  const handleConnect = async () => {
    const success = await connect();
    if (success) {
      console.log('Connected via bluetooth');
    }
  };

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
          onClick={handleConnect}
          className={connected ? "bg-green-500 hover:bg-green-600" : ""}
        >
          <Bluetooth className="w-4 h-4 mr-2" />
          {connected ? "Connected" : "Connect"}
        </Button>
        
        {connected && (
          <>
            <Button variant="secondary" onClick={() => handleSendCommand("2")}>
              <Send className="w-4 h-4 mr-2" />
              Send "2"
            </Button>
            <Button variant="secondary" onClick={() => handleSendCommand("3")}>
              <Send className="w-4 h-4 mr-2" />
              Send "3"
            </Button>
          </>
        )}
        
        <VoiceSelector onVoiceChange={onVoiceChange} />
      </div>
    </div>
  );
}

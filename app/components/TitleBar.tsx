import { VoiceSelector } from "./VoiceSelector";
import { Button } from "./ui/button";
import { useBluetooth } from "~/hooks/useBluetooth";
import { Bluetooth, Send, Usb } from "lucide-react";
import { useUSB } from "~/hooks/useUSB";

interface TitleBarProps {
  onVoiceChange: (voice: SpeechSynthesisVoice) => void;
}

export function TitleBar({ onVoiceChange }: TitleBarProps) {
  const {
    connected: bluetoothConnected,
    connect: connectBluetooth,
    sendCommand: sendBluetoothCommand,
  } = useBluetooth();
  const {
    connected: usbConnected,
    connect: connectUSB,
    sendCommand: sendUSBCommand,
  } = useUSB();

  const handleConnect = async () => {
    const success = await connectBluetooth();
    if (success) {
      console.log("Connected via bluetooth");
    }
  };

  const handleSendCommand = async (command: string) => {
    const success = await sendUSBCommand(command);
    if (success) {
      console.log(`Sent command: ${command}`);
    }
  };

  const handleUsbConnect = async () => {
    const success = await connectUSB();
    if (success) {
      console.log("Connected via USB");
    }
  };

  return (
    <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-3xl font-bold">Torta na Cara Bíblico</h1>
      <div className="flex items-center gap-4">
        <Button
          variant="secondary"
          onClick={handleConnect}
          className={
            bluetoothConnected ? "bg-green-500 hover:bg-green-600" : ""
          }
        >
          <Bluetooth className="w-4 h-4 mr-2" />
          {bluetoothConnected ? "Connected" : "Connect"}
        </Button>

        <Button
          variant="secondary"
          onClick={handleUsbConnect}
          className={usbConnected ? "bg-green-500 hover:bg-green-600" : ""}
        >
          <Usb className="w-4 h-4 mr-2" />
          {usbConnected ? "USB Connected" : "Connect USB"}
        </Button>

        {usbConnected && (
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

import { useState } from "react";

interface UseUSBReturn {
  port: SerialPort | null;
  connected: boolean;
  connect: () => Promise<boolean>;
  disconnect: () => Promise<boolean>;
  sendCommand: (command: string) => Promise<boolean>;
}

export function useUSB(): UseUSBReturn {
  const [port, setPort] = useState<SerialPort | null>(null);
  const [connected, setConnected] = useState(false);

  const connect = async (): Promise<boolean> => {
    try {
      const port = await navigator.serial.requestPort({
        // Add filters if needed
        // filters: [{ usbVendorId: 0x2341 }] // Example for Arduino
      });

      await port.open({
        baudRate: 9600,
        dataBits: 8,
        stopBits: 1,
        parity: "none",
        flowControl: "none",
      });

      setPort(port);
      setConnected(true);
      return true;
    } catch (error) {
      console.error("Failed to connect to Serial port:", error);
      return false;
    }
  };

  const disconnect = async (): Promise<boolean> => {
    try {
      if (port) {
        await port.close();
        setPort(null);
        setConnected(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to disconnect Serial port:", error);
      return false;
    }
  };

  const sendCommand = async (command: string): Promise<boolean> => {
    if (!port || !connected) {
      console.error("No Serial port connected");
      return false;
    }

    try {
      const writer = port.writable.getWriter();
      const encoder = new TextEncoder();
      const data = encoder.encode(command + "\n"); // Add newline for Arduino readability

      await writer.write(data);
      writer.releaseLock();
      return true;
    } catch (error) {
      console.error("Failed to send command:", error);
      return false;
    }
  };

  return {
    port,
    connected,
    connect,
    disconnect,
    sendCommand,
  };
}

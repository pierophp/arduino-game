import { useCallback, useState } from "react";
import { useBluetooth } from "./useBluetooth";
import { useUSB } from "./useUSB";

interface UseCommandReturn {
  connected: boolean;
  connectionType: "usb" | "bluetooth" | null;
  connectBluetooth: () => Promise<boolean>;
  connectUSB: () => Promise<boolean>;
  sendCommand: (command: string) => Promise<boolean>;
}

export function useCommand(): UseCommandReturn {
  const [connectionType, setConnectionType] = useState<
    "usb" | "bluetooth" | null
  >(null);

  const {
    connected: bluetoothConnected,
    connect: connectBluetoothDevice,
    sendCommand: sendBluetoothCommand,
  } = useBluetooth();

  const {
    connected: usbConnected,
    connect: connectUSBDevice,
    sendCommand: sendUSBCommand,
  } = useUSB();

  const connectBluetooth = useCallback(async () => {
    const success = await connectBluetoothDevice();
    if (success) {
      setConnectionType("bluetooth");
    }
    return success;
  }, [connectBluetoothDevice]);

  const connectUSB = useCallback(async () => {
    const success = await connectUSBDevice();
    if (success) {
      setConnectionType("usb");
    }
    return success;
  }, [connectUSBDevice]);

  const sendCommand = useCallback(
    async (command: string) => {
      if (usbConnected) {
        return sendUSBCommand(command);
      }

      if (bluetoothConnected) {
        return sendBluetoothCommand(command);
      }

      console.error("No device connected");
      return false;
    },
    [bluetoothConnected, usbConnected, sendBluetoothCommand, sendUSBCommand]
  );

  return {
    connected: usbConnected || bluetoothConnected,
    connectionType,
    connectBluetooth,
    connectUSB,
    sendCommand,
  };
}

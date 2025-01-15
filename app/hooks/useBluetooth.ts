import { useState, useCallback } from "react";

export function useBluetooth() {
  const [device, setDevice] = useState<BluetoothDevice | null>(null);
  const [characteristic, setCharacteristic] =
    useState<BluetoothRemoteGATTCharacteristic | null>(null);

  const connect = useCallback(async () => {
    try {
      const serviceUuid = "0000ffe0-0000-1000-8000-00805f9b34fb";
      const characteristicUuid = "0000ffe1-0000-1000-8000-00805f9b34fb";

      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [serviceUuid],
        // filters: [
        //   { name: 'HC-05' },
        //   { services: ['0000ffe0-0000-1000-8000-00805f9b34fb'] }
        // ],
      });

      device.addEventListener("gattserverdisconnected", () => {
        console.log("Disconnected");
      });

      const server = await device.gatt?.connect();
      const service = await server?.getPrimaryService(serviceUuid);
      const characteristic = await service?.getCharacteristic(
        characteristicUuid
      );

      console.log("Connected");
      console.log({ server });
      console.log({ service });
      console.log({ characteristic });

      setDevice(device);
      setCharacteristic(characteristic);

      return true;
    } catch (error) {
      console.error("Bluetooth connection failed:", error);
      return false;
    }
  }, []);

  const sendCommand = useCallback(
    async (command: string) => {
      if (!characteristic) {
        console.error("No Bluetooth connection");
        return false;
      }

      try {
        console.log("Sending command:", command);
        const encoder = new TextEncoder();
        await characteristic.writeValue(encoder.encode(command));
        return true;
      } catch (error) {
        console.error("Failed to send command:", error);
        return false;
      }
    },
    [characteristic]
  );

  return {
    device,
    connected: !!characteristic,
    connect,
    sendCommand,
  };
}

import { createContext, useContext, type ReactNode } from "react";
import { useCommand } from "~/hooks/useCommand";

interface CommandContextType {
  connected: boolean;
  connectionType: "usb" | "bluetooth" | null;
  connectBluetooth: () => Promise<boolean>;
  connectUSB: () => Promise<boolean>;
  sendCommand: (command: string) => Promise<boolean>;
}

const CommandContext = createContext<CommandContextType | null>(null);

export function CommandProvider({ children }: { children: ReactNode }) {
  const commandUtils = useCommand();

  return (
    <CommandContext.Provider value={commandUtils}>
      {children}
    </CommandContext.Provider>
  );
}

export function useCommandContext() {
  const context = useContext(CommandContext);
  if (!context) {
    throw new Error("useCommandContext must be used within a CommandProvider");
  }
  return context;
}

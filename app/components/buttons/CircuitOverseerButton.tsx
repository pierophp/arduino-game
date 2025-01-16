import { Briefcase } from "lucide-react";
import { Button } from "~/components/ui/button";

interface CircuitOverseerButtonProps {
  onClick: () => void;
}

export function CircuitOverseerButton({ onClick }: CircuitOverseerButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="flex-1 items-center gap-2 bg-purple-600 hover:bg-purple-700"
    >
      <Briefcase className="w-5 h-5" />
      Superintendente
    </Button>
  );
}

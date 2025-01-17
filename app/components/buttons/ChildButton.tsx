import { Baby } from "lucide-react";
import { Button } from "~/components/ui/button";

interface ChildButtonProps {
  onClick: () => void;
}

export function ChildButton({ onClick }: ChildButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="flex-1 items-center h-10 gap-2 bg-fuchsia-600 hover:bg-fuchsia-700"
    >
      <Baby className="w-5 h-5" />
      Criança
    </Button>
  );
}

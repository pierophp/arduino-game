import { User } from "lucide-react";
import { Button } from "~/components/ui/button";

interface AdultButtonProps {
  onClick: () => void;
}

export function AdultButton({ onClick }: AdultButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="flex-1 items-center gap-2 bg-sky-600 hover:bg-sky-700"
    >
      <User className="w-5 h-5" />
      Adulto
    </Button>
  );
}

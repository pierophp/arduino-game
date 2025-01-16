import { ScanFace } from "lucide-react";
import { Button } from "~/components/ui/button";

interface TeenButtonProps {
  onClick: () => void;
}

export function TeenButton({ onClick }: TeenButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="flex-1 items-center gap-2 bg-lime-600 hover:bg-lime-700"
    >
      <ScanFace className="w-5 h-5" />
      Jovem
    </Button>
  );
}

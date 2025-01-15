import type { Route } from "./+types/home";
import { BiblicalQuizGame } from "~/components/BiblicalQuizGame";
import { CommandProvider } from "~/providers/CommandProvider";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Torta na Cara Bíblico" },
    { name: "description", content: "Torta na Cara Bíblico!" },
  ];
}

export default function Home() {
  return (
    <CommandProvider>
      <BiblicalQuizGame />
    </CommandProvider>
  );
}

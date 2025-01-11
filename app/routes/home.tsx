import type { Route } from "./+types/home";
import { BiblicalQuizGame } from "~/components/BiblicalQuizGame";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Torta na Cara Bíblico" },
    { name: "description", content: "Torta na Cara Bíblico!" },
  ];
}

export default function Home() {
  return <BiblicalQuizGame />;
}

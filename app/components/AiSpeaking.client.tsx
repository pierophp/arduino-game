import Lottie from "react-lottie";

import animationData from "../lottie/ai.json";

interface AiSpeakingProps {
  speaking: boolean;
}

export function AiSpeaking({ speaking }: AiSpeakingProps) {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <Lottie
      options={defaultOptions}
      height={200}
      width={200}
      isPaused={!speaking}
    />
  );
  // return <div className="flex items-center justify-center gap-1"></div>;
}

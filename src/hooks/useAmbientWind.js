import { useEffect, useRef } from "react";
import { createWindHowl } from "../utils/audio";

export function useAmbientWind(enabled) {
  const howlRef = useRef(null);

  useEffect(() => {
    if (!howlRef.current) {
      howlRef.current = createWindHowl();
    }

    if (enabled) {
      howlRef.current.play();
    } else {
      howlRef.current.pause();
    }

    return () => {
      howlRef.current?.pause();
    };
  }, [enabled]);
}

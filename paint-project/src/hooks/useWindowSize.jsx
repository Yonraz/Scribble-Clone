import { useState, useEffect } from "react";
export default function useWindowSize() {
  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth / 2);
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight / 1.4);

  const setCanvasSize = () => {
    setCanvasWidth(window.innerWidth / 2);
    setCanvasHeight(window.innerHeight / 1.4);
  };

  useEffect(() => {
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);
    return () => {
      window.removeEventListener("resize", setCanvasSize);
    };
  }, []);

  return { canvasWidth, canvasHeight };
}

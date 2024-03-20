import { useContext } from "react";
import { BrushContext } from "../state/BrushContext";

export const useBrush = () => {
  const context = useContext(BrushContext);
  if (!context) {
    throw new Error("useBrush must be used within a BrushProvider");
  }
  return context;
};

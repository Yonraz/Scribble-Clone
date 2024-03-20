/* eslint-disable react/prop-types */
import { createContext, useState } from "react";
import { brushTypesDict } from "../utility/brushTypesEnum";

export const BrushContext = createContext();

export const BrushProvider = ({ children }) => {
  const [brushSize, setBrushSize] = useState(10);
  const [brushColor, setBrushColor] = useState("black");
  const [brushType, setBrushType] = useState(brushTypesDict.brush);

  const updateBrushColor = (color) => {
    setBrushColor(color);
  };

  const updateBrushType = (newBrushType) => {
    if (!Object.values(brushTypesDict).includes(newBrushType))
      throw new Error("brush doesnt exist");
    setBrushType((prevBrushType) => {
      if (prevBrushType === newBrushType) {
        return prevBrushType;
      }
      return newBrushType;
    });
  };

  const updateBrushSize = (size) => {
    setBrushSize(size);
  };

  return (
    <BrushContext.Provider
      value={{
        brushColor,
        brushSize,
        brushType,
        updateBrushColor,
        updateBrushSize,
        updateBrushType,
      }}
    >
      {children}
    </BrushContext.Provider>
  );
};

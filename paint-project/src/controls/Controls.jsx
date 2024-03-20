/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import ColorPicker from "./ColorPicker";
import "./Controls.css";
import SizePicker from "./SizePicker";
import NewCanvas from "../canvas/NewCanvas";
import Brushes from "./Brushes";
import { socket } from "../../socket";
import { useBrush } from "../hooks/useBrush";

const Controls = () => {
  const { brushColor, updateBrushColor, brushSize, updateBrushSize } =
    useBrush();
  const [clearCanvas, setClearCanvas] = useState(false);
  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth / 2);
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight / 1.4);

  const setCanvasSize = () => {
    setCanvasWidth(window.innerWidth / 2);
    setCanvasHeight(window.innerHeight / 1.4);
  };

  useEffect(() => {
    console.log("did mount");
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);
    return () => {
      window.removeEventListener("resize", setCanvasSize);
    };
  }, []);
  const handleClear = () => {
    setClearCanvas(true);
    socket.emit("clear-canvas");
  };

  const handleCleared = () => {
    setClearCanvas(false);
  };
  const handleSendColor = (color) => {
    console.log(color);
    updateBrushColor(color);
  };
  const handleSendSize = (size) => {
    updateBrushSize(size);
  };
  return (
    <>
      <div className="controls">
        <NewCanvas
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
          clearCanvas={clearCanvas}
          onCanvasCleared={handleCleared}
          brush={{ color: brushColor, size: brushSize }}
        />
        <div className="brushes-section-container">
          <Brushes />
        </div>
        <div className="color-size-container">
          <ColorPicker sendColor={handleSendColor} />
          <SizePicker sendSize={handleSendSize} color={brushColor} />
        </div>
      </div>
      <div className="clear-save-container">
        <button className="clear btn" onClick={handleClear}>
          Clear
        </button>
        <button className="save btn">Save</button>
      </div>
    </>
  );
};

export default Controls;

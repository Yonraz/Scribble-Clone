import Controls from "../../controls/Controls";
import Canvas from "../../canvas/Canvas";
import { useState } from "react";
import { socket } from "../../../socket";
import "./Paint.css";

export default function Paint() {
  const [clearCanvas, setClearCanvas] = useState(false);
  const handleClear = () => {
    setClearCanvas(true);
    socket.emit("clear-canvas");
  };

  const handleCleared = () => {
    setClearCanvas(false);
  };

  return (
    <>
      <div className="paint-container">
        <Canvas clearCanvas={clearCanvas} onCanvasCleared={handleCleared} />
        <Controls handleClear={handleClear} />
      </div>
    </>
  );
}

/* eslint-disable react/prop-types */
import { useState } from "react";
import ColorPicker from "./ColorPicker";
import "./Controls.css";
import SizePicker from "./SizePicker";
import NewCanvas from "../canvas/NewCanvas";
import Brushes from "./Brushes";
import { socket } from "../../socket";

const Controls = () => {
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
      <div className="controls">
        <NewCanvas clearCanvas={clearCanvas} onCanvasCleared={handleCleared} />
        <div className="brushes-section-container">
          <Brushes />
        </div>
        <div className="color-size-container">
          <ColorPicker />
          <SizePicker />
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

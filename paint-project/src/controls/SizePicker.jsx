/* eslint-disable react/prop-types */
import "./SizePicker.css";
import { useBrush } from "../hooks/useBrush";

const SizePicker = () => {
  const { brushColor, brushSize, updateBrushSize } = useBrush();

  const handleSizeChange = (e) => {
    updateBrushSize(e.target.value);
  };
  return (
    <div className="brush-size">
      <div
        style={{
          width: brushSize + "px",
          height: brushSize + "px",
          backgroundColor: brushColor,
        }}
        className="brush-demo"
      ></div>
      <div className="slider-lable-container">
        <input
          type="range"
          id="brush-size"
          min="2"
          max="100"
          step="2"
          value={brushSize}
          onChange={handleSizeChange}
        />
        <label htmlFor="brush-size">Size</label>
      </div>
    </div>
  );
};

export default SizePicker;

/* eslint-disable react/prop-types */
// import { SketchPicker } from "react-color";
import { CirclePicker } from "react-color";
import "./ColorPicker.css";
import { useBrush } from "../hooks/useBrush";

const ColorPicker = () => {
  const { brushColor, updateBrushColor } = useBrush();

  const handleColorChange = (c) => {
    updateBrushColor(c);
  };
  return (
    <div className="color-picker-container">
      <CirclePicker
        id="color-picker"
        className="color-picker"
        colors={[
          "#000",
          "#ff2000",
          "#ff7c00",
          "#f52394",
          "#7f00ff",
          "#0062c6",
          "#00b2d4",
          "#00ab00",
          "#ffcf00",
          "#c4c4c4",
          "#593110",
          "#cddc39",
        ]}
        color={brushColor}
        disableAlpha={true}
        onChange={(c) => handleColorChange(c.hex)}
      />
      <label htmlFor="color-picker">Color</label>
    </div>
  );
};
export default ColorPicker;

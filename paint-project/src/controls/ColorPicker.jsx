/* eslint-disable react/prop-types */
import { SketchPicker } from "react-color";
import "./ColorPicker.css";
import { useBrush } from "../hooks/useBrush";

const ColorPicker = () => {
  const { brushColor, updateBrushColor } = useBrush();

  const handleColorChange = (c) => {
    updateBrushColor(c);
  };
  return (
    <div className="color-picker">
      <SketchPicker
        id="color-picker"
        color={brushColor}
        disableAlpha={true}
        onChange={(c) => handleColorChange(c.hex)}
      />
      <label htmlFor="color-picker">Color</label>
    </div>
  );
};
export default ColorPicker;

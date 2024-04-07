/* eslint-disable react/prop-types */
import ColorPicker from "./ColorPicker";
import "./Controls.css";
import SizePicker from "./SizePicker";
import Brushes from "./Brushes";

const Controls = (props) => {
  const { handleClear } = props;
  return (
    <div className="controls">
      <div className="brush-and-size-container">
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
    </div>
  );
};

export default Controls;

/* eslint-disable react/prop-types */
import { useBrush } from "../hooks/useBrush";
import { brushTypesDict } from "../utility/brushTypesEnum";
import "./Brushes.css";
const Brushes = () => {
  const { brushType, updateBrushType } = useBrush();
  const brushes = Object.values(brushTypesDict);
  const handleClick = (newBrushType) => {
    updateBrushType(newBrushType);
  };

  function getFaIconClassName(brushName) {
    let className = "fa ";
    switch (brushName) {
      case brushTypesDict.brush:
        className += "fa-paint-brush";
        break;
      case brushTypesDict.eraser:
        className += "fa-eraser";
        break;
      case brushTypesDict.fill:
        className += "fa-tint";
        break;
      default:
        className += "fa-paint-brush";
    }
    return className;
  }
  return (
    <>
      <div className="brushes-container">
        <label htmlFor="brush-type">Brush Type</label>

        <div className="brushes">
          {brushes.map((brush, i) => (
            <button
              id={`${brush}-btn`}
              className={
                brushType === brush ? `${brush} btn active` : `${brush} btn`
              }
              onClick={() => handleClick(brush)}
              key={i}
            >
              <i className={getFaIconClassName(brush)} aria-hidden="true"></i>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Brushes;

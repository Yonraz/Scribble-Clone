/* eslint-disable react/prop-types */
import { useRef, useEffect, useCallback, useState } from "react";
import "./Canvas.css";
import { socket } from "../../socket";
import Cursor from "../Components/cursor/Cursor";
import { useBrush } from "../hooks/useBrush";
import { brushTypesDict } from "../utility/brushTypesEnum";
import { floodFill } from "../utility/floodfillHelpers";

const NewCanvas = (props) => {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const ctx = useRef(null);
  const returnBtn = useRef(null);
  const canvasStack = useRef([]);
  const { brushColor, brushSize, brushType } = useBrush();
  const [socketErase, setSocketErase] = useState(false);

  let mouseMoveDebounceTimeout;

  let cursorPosition = useRef({
    current: { y: 0, x: 0 },
    prev: { y: 0, x: 0 },
  });

  const updateCanvasStyle = useCallback(
    (color = brushColor, size = brushSize) => {
      ctx.current.fillStyle = color;
      ctx.current.strokeStyle = color;
      ctx.current.lineWidth = size;
      ctx.current.lineJoin = "round";
      ctx.current.lineCap = "round";
    },
    [brushColor, brushSize]
  );

  const updateBrushMode = useCallback(() => {
    if (brushType === brushTypesDict.eraser) {
      ctx.current.globalCompositeOperation = "destination-out";
    } else {
      ctx.current.globalCompositeOperation = "source-over";
    }
  }, [brushType]);

  const updateCanvasStack = () => {
    if (canvasStack.current.length > 10) {
      canvasStack.current.shift();
    }
    canvasStack.current.push(
      ctx.current.getImageData(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      )
    );
  };
  const clearCanvas = () => {
    ctx.current.clearRect(0, 0, props.canvasWidth, props.canvasHeight);
    updateCanvasStack();
    props.onCanvasCleared();
  };
  // did mount
  useEffect(() => {
    const canvas = canvasRef.current;
    const returnBtnElement = returnBtn.current;
    ctx.current = canvas.getContext("2d", {
      willReadFrequently: true,
    });
    socket.on("set-clear-canvas", clearCanvas);
    socket.on("user-started-drawing", handleSocketDraw);
    socket.on("user-stopped-drawing", handleStopDraw);
    socket.on("user-mousemove", handleSocketMouseMove);
    socket.on("user-flood-fill", handleFloodFill);

    updateCanvasStyle();
    updateCanvasStack();

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleUserStopDraw);
    returnBtnElement.addEventListener("click", getLastCanvasState);
    // unmount
    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleUserStopDraw);
      returnBtnElement.removeEventListener("click", getLastCanvasState);
      socket.off("set-clear-canvas", clearCanvas);
      socket.off("user-started-drawing", handleSocketDraw);
      socket.off("user-stopped-drawing", handleStopDraw);
      socket.off("user-mousemove", handleSocketMouseMove);
      socket.off("user-flood-fill", handleFloodFill);
    };
  }, []);

  useEffect(() => {
    if (socketErase) {
      ctx.current.globalCompositeOperation = "destination-out";
    } else {
      ctx.current.globalCompositeOperation = "source-over";
    }
  }, [socketErase]);

  function handleSocketDraw(data) {
    const { color, size, type } = data.brush;
    if (type === brushTypesDict.eraser) {
      setSocketErase(true);
    }
    updateCanvasStyle(color, size);
    handleMouseClickOnCanvas(data.position);
  }
  const handleMouseClickOnCanvas = (pos) => {
    cursorPosition.current.current.x = pos.originalX;
    cursorPosition.current.current.y = pos.originalY;
    ctx.current.beginPath();
    ctx.current.fillRect(pos.originalX, pos.originalY, 2, 2);
    ctx.current.closePath();
  };

  const handleFloodFill = (mousePosition) => {
    const newImageData = floodFill(
      ctx.current,
      mousePosition.originalX,
      mousePosition.originalY,
      ctx.current.fillStyle
    );
    ctx.current.putImageData(newImageData, 0, 0);
    updateCanvasStack();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    function handleUserDraw(e) {
      const pos = getMousePos(e);
      socket.emit("start-draw", {
        position: { clientX: e.clientX, clientY: e.clientY },
        brush: { type: brushType, color: brushColor, size: brushSize },
      });
      if (brushType === brushTypesDict.fill) {
        socket.emit("user-flood-fill", pos);
        handleFloodFill(pos);
        return;
      }
      handleMouseClickOnCanvas(pos);
      isDrawing.current = true;
    }
    canvas.addEventListener("mousedown", handleUserDraw);
    return () => {
      canvas.removeEventListener("mousedown", handleUserDraw);
    };
  }, [brushType, brushColor, brushSize]);

  // did update
  useEffect(() => {
    updateCanvasStyle();
  }, [updateCanvasStyle]);

  useEffect(() => {
    if (props.clearCanvas) {
      clearCanvas();
      props.onCanvasCleared();
    }
  }, [props.clearCanvas, props.onCanvasCleared]);

  useEffect(() => {
    updateCanvasStack();
  }, [props.width, props.height]);

  useEffect(() => {
    updateBrushMode();
  }, [updateBrushMode]);

  const handleUserStopDraw = () => {
    socket.emit("stop-draw");
    const userStopped = true;
    handleStopDraw(userStopped);
  };

  const handleStopDraw = (userStopped) => {
    if (socketErase && brushType !== brushTypesDict.eraser) {
      setSocketErase(false);
    }
    isDrawing.current = false;
    if (!userStopped) updateCanvasStyle();
    updateCanvasStack();
    if (canvasStack.current.length > 10) {
      canvasStack.current.shift();
    }
  };

  const handleSocketMouseMove = (data) => {
    const { pos, x, y } = data;
    cursorPosition.current.prev.x = x;
    cursorPosition.current.prev.y = y;
    cursorPosition.current.current.x = pos.originalX;
    cursorPosition.current.current.y = pos.originalY;
    draw();
  };

  const handleMouseMove = (e) => {
    if (isDrawing.current) {
      clearTimeout(mouseMoveDebounceTimeout);
      mouseMoveDebounceTimeout = setTimeout(() => {
        const pos = getMousePos(e);
        socket.emit("user-move", {
          pos,
          x: cursorPosition.current.current.x,
          y: cursorPosition.current.current.y,
        });
        cursorPosition.current.prev.x = cursorPosition.current.current.x;
        cursorPosition.current.prev.y = cursorPosition.current.current.y;
        cursorPosition.current.current.x = pos.originalX;
        cursorPosition.current.current.y = pos.originalY;
        draw();
      }, 5);
    }
  };

  const draw = () => {
    ctx.current.beginPath();
    ctx.current.moveTo(
      cursorPosition.current.prev.x,
      cursorPosition.current.prev.y
    );
    ctx.current.lineTo(
      cursorPosition.current.current.x,
      cursorPosition.current.current.y
    );
    ctx.current.stroke();
    ctx.current.closePath();
  };

  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      originalX: e.clientX - rect.left,
      originalY: e.clientY - rect.top,
    };
  };

  const getLastCanvasState = () => {
    if (canvasStack.current.length > 1) {
      canvasStack.current.pop();
      ctx.current.putImageData(
        canvasStack.current[canvasStack.current.length - 1],
        0,
        0
      );
    }
  };

  return (
    <>
      <div className="container">
        <Cursor
          brushType={brushType}
          brush={{ color: brushColor, size: brushSize }}
        />
        <canvas
          className="canvas"
          id="canvas"
          ref={canvasRef}
          width={props.canvasWidth}
          height={props.canvasHeight}
        />
        <button ref={returnBtn} className="return-btn">
          <i className="fa fa-undo"></i>
        </button>
      </div>
    </>
  );
};
export default NewCanvas;

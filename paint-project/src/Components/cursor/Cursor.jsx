/* eslint-disable react/prop-types */
import { useCallback, useEffect } from "react";
import "./Cursor.css";

export default function Cursor(props) {
  const { brushType, brush } = props;

  useEffect(() => {
    let debounce;

    const setCursorPosition = (e) => {
      const cursor = document.querySelector("[data-cursor-dot]");
      const cursorOutline = document.querySelector("[data-cursor-outline]");
      const top = `${e.clientY}px`;
      const left = `${e.clientX}px`;
      cursor.style.top = top;
      cursor.style.left = left;
      cursorOutline.style.top = top;
      cursorOutline.style.left = left;
    };

    function handleMouseMove(e) {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        setCursorPosition(e);
      }, 5);
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const setCursorStyle = useCallback(() => {
    const cursorDot = document.querySelector("[data-cursor-dot]");
    const cursorOutline = document.querySelector("[data-cursor-outline]");
    if (cursorDot) {
      cursorDot.style.width = `${brush.size}px`;
      cursorDot.style.height = `${brush.size}px`;
      cursorDot.style.backgroundColor =
        brushType !== "eraser" ? `${brush.color}` : "white";
    }
    if (cursorOutline) {
      cursorOutline.style.width = `${(brush.size + 1) / 4}px`;
      cursorOutline.style.height = `${(brush.size + 1) / 4}px`;
    }
  }, [brush, brushType]);

  useEffect(() => {
    setCursorStyle();
  }, [setCursorStyle]);

  return (
    <>
      <div
        className={
          brushType === "eraser" ? "cursor-dot cursor-eraser" : "cursor-dot"
        }
        data-cursor-dot
      ></div>
      <div className="cursor-outline" data-cursor-outline></div>
    </>
  );
}

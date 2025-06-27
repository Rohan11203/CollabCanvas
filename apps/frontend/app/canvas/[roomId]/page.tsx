"use client";
import { useEffect, useRef } from "react";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function initCanvas() {
    if (canvasRef.current) {
      const canvas = canvasRef.current;

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        return;
      }

      let clicked = false;
      let startX = 0;
      let startY = 0;

      canvas.addEventListener("mousedown", (e) => {
        clicked = true;
        startX = e.clientX;
        startY = e.clientY;
        console.log(startX);
        console.log(startY);
      });

      canvas.addEventListener("mouseup", (e) => {
        clicked = false;
      });

      canvas.addEventListener("mousemove", (e) => {
        if (clicked) {
          const width = e.clientX - startX;
          const height = e.clientY - startY;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.strokeRect(startX, startY, width, height);
        }
      });
    }
  }


  useEffect(() => {
    initCanvas()
  }, [canvasRef]);
  return <canvas ref={canvasRef} height={1080} width={1000}></canvas>;
}

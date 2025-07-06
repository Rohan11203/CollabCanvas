import { initDraw } from "@/draw";
import { useEffect, useRef } from "react";
import { IconButton } from "./InconButton";
import { Circle, Pencil, RectangleHorizontal } from "lucide-react";
import { useState } from "react";

type Shape = "circle" | "rect" | "pencil";
export function Canvas({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<Shape>("circle");

  // remove in future
  useEffect(() => {
    //@ts-ignore
    window.selectedTool = selectedTool
  },[selectedTool])


  useEffect(() => {
    if (!canvasRef.current || !socket) return;

    // initDraw returns a cleanup fn (we added that in the last snippet)
    initDraw(canvasRef.current, roomId, socket);
  }, [canvasRef, socket, roomId]);

  return (
    <div
      style={{
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <canvas
        width={window.innerWidth}
        height={window.innerHeight}
        ref={canvasRef}
      ></canvas>
      <TopBar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
    </div>
  );
}

function TopBar({
  selectedTool,
  setSelectedTool,
}: {
  selectedTool: Shape;
  setSelectedTool: (e: Shape) => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        top: 10,
        left: 10,
      }}
    >
      <div className="flex gap-2 ">
        <IconButton
          activated={selectedTool === "pencil"}
          icon={<Pencil />}
          onClick={() => {
            setSelectedTool("pencil");
          }}
        ></IconButton>
        <IconButton
          activated={selectedTool === "rect"}
          icon={<RectangleHorizontal />}
          onClick={() => {
            setSelectedTool("rect");
          }}
        ></IconButton>
        <IconButton
          activated={selectedTool === "circle"}
          icon={<Circle />}
          onClick={() => {
            setSelectedTool("circle");
          }}
        ></IconButton>
      </div>
    </div>
  );
}

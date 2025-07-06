import { initDraw } from "@/draw";
import { useEffect, useRef } from "react";
import { IconButton } from "./InconButton";
import { Circle, Pencil, RectangleHorizontal } from "lucide-react";

export function Canvas({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      <TopBar />
    </div>
  );
}

function TopBar() {
  return (
    <div style={{
      position: "fixed",
      top : 10,
      left : 10
    }}>
      <div className="flex gap-2 bg-red-600">
        <IconButton icon={<Pencil />} onClick={() => {}}></IconButton>
        <IconButton
          icon={<RectangleHorizontal />}
          onClick={() => {}}
        ></IconButton>
        <IconButton icon={<Circle />} onClick={() => {}}></IconButton>
      </div>
    </div>
  );
}

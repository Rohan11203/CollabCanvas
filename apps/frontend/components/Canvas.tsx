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
    <div className="h-[100vh] overflow-hidden ">
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
    <div className="fixed  top-0 left-0 z-50 p-2 bg-red-500 bg-red-500">
      <div className="flex gap-2">
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

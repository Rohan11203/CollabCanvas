import { initDraw } from "@/draw";
import { useEffect, useRef } from "react";

export function Canvas({ roomId, socket }: { roomId: string, socket: WebSocket }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      initDraw(canvasRef.current, roomId,socket);
    }
  }, [canvasRef]);

  return (
    <div className="h-[100vh] overflow-hidden">
      <canvas width={window.innerWidth} height={window.innerHeight} ref={canvasRef}></canvas>
    </div>
  );
}

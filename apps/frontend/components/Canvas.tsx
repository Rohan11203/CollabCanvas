"use client";
import { useEffect, useRef } from "react";
import { IconButton } from "./InconButton";
import { Circle, Copy, Pencil, RectangleHorizontal } from "lucide-react";
import { useState } from "react";
import { Game } from "@/draw/Game";
import { useRouter } from "next/navigation";

export type Tool = "circle" | "rect" | "pencil";
export function Canvas({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [game, setGame] = useState<Game>();
  const [selectedTool, setSelectedTool] = useState<Tool>("circle");
  const router = useRouter();

  useEffect(() => {
    game?.setTool(selectedTool);
  }, [selectedTool]);

  useEffect(() => {
    if (canvasRef.current) {
      const g = new Game(canvasRef.current, roomId, socket, router);
      setGame(g);

      return () => {
        g.destroy();
      };
    }
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
      <TopBar
        roomId={roomId}
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
      />
    </div>
  );
}

function TopBar({
  selectedTool,
  setSelectedTool,
  roomId,
}: {
  selectedTool: Tool;
  setSelectedTool: (e: Tool) => void;
  roomId: string;
}) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyId = () => {
    // 2. Use the 'roomId' prop to copy the ID
    navigator.clipboard.writeText(roomId).then(() => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    });
  };

  return (
    <>
      <div className="fixed top-7  sm:right-10 right-5  sm:top-5  z-10">
        <button
          onClick={handleCopyId}
          className="flex items-center gap-2 text-white bg-gray-800 px-3 py-2 rounded-xl shadow-md border border-gray-200 hover:bg-gray-700 transition"
        >
          <Copy size={20} />
          {isCopied ? "Copied!" : "Share"}
        </button>
      </div>

      <div className="fixed top-5 sm:left-1/2 left-1/3   -translate-x-1/2 z-10">
        <div className="flex items-center gap-4 p-2 bg-gray-800 rounded-xl shadow-md border border-gray-200">
          <IconButton
            activated={selectedTool === "pencil"}
            icon={<Pencil size={20} />}
            onClick={() => setSelectedTool("pencil")}
          />
          <IconButton
            activated={selectedTool === "rect"}
            icon={<RectangleHorizontal size={20} />}
            onClick={() => setSelectedTool("rect")}
          />
          <IconButton
            activated={selectedTool === "circle"}
            icon={<Circle size={20} />}
            onClick={() => setSelectedTool("circle")}
          />
        </div>
      </div>
    </>
  );
}

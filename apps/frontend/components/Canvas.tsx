"use client";
import { useEffect, useRef } from "react";
import { IconButton } from "./InconButton";
import { Circle, Pencil, RectangleHorizontal } from "lucide-react";
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
        g.distroy();
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
      <TopBar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
    </div>
  );
}

function TopBar({
  selectedTool,
  setSelectedTool,
}: {
  selectedTool: Tool;
  setSelectedTool: (e: Tool) => void;
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

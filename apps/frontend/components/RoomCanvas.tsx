"use client";

import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";
import { WS_URL } from "@/config";

export function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  // const token = localStorage.getItem("token");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjNWY2NTgzNS1mODFlLTQzYjctODY4Yy0yZGJmY2YyYTk0NzIiLCJlbWFpbCI6InJvaGFuQGdtYWlsLmNvbSIsImlhdCI6MTc1MTgwNDQyNSwiZXhwIjoxNzUxODExNjI1fQ._2leGwqrAh-auaraWFieCz_IBx1Kup4cZUBVUC7Rdj4";
  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}?token=${token}`);

    ws.onopen = () => {
      setSocket(ws);
      const data = JSON.stringify({
        type: "join-room",
        roomId,
      });
      console.log(data);
      ws.send(data);
    };
  }, []);

  if (!socket) {
    return <div>Connecting to server....</div>;
  }
  return (
    <div>
      
      <Canvas
        roomId={roomId}
        socket={socket}
      />
    </div>
  );
}

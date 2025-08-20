"use client";

import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";
import { WS_URL } from "@/config";
import { useSession } from "next-auth/react";

export function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.accessToken) {
      return;
    }

    const ws = new WebSocket(`${WS_URL}?token=${session?.accessToken}`);

    ws.onopen = () => {
      setSocket(ws);
      const data = JSON.stringify({
        type: "join-room",
        roomId,
      });
      ws.send(data);
    };

    return () => {
      console.log("Closing WebSocket");
      ws.close();
    };
  }, [roomId, session?.accessToken]);

  if (!socket) {
    return <div>Connecting to server....</div>;
  }
  return (
    <div>
      <Canvas roomId={roomId} socket={socket} />
    </div>
  );
}

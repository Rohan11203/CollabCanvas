import { WebSocket, WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";

interface Connection {
  ws: WebSocket;
  userId: string;
  rooms: Set<string>;
}

type RoomsMap = Map<string, Set<WebSocket>>;

const connections: Map<WebSocket, Connection> = new Map();
const rooms: RoomsMap = new Map();

function checkUser(token: string): string | null {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return typeof decoded.sub === "string" ? decoded.sub : null;
  } catch {
    return null;
  }
}

type Message = {
  type: "join-room" | "chat" | "leave-room";
  roomId: string;
  message?: string;
};

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws, req) => {
  const params = new URLSearchParams((req.url || "").split("?", 2)[1]);
  const userId = checkUser(params.get("token") || "");
  if (!userId) {
    ws.close(1008, "Authentication required");
    return;
  }

  connections.set(ws, { ws, userId, rooms: new Set() });

  ws.on("message", async (raw) => {
    let msg: Message;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      return ws.send(JSON.stringify({ error: "Invalid JSON" }));
    }

    const { type, roomId, message } = msg;
    const conn = connections.get(ws)!;

    switch (type) {
      case "join-room": {
        if (!roomId) {
          return ws.send(JSON.stringify({ error: "No room specified" }));
        }
        try {
          const dbRoom = await prismaClient.room.findFirst({
            where: { id: Number(roomId) },
          });
          if (!dbRoom) {
            return ws.send(JSON.stringify({ error: "Room not found" }));
          }

          conn.rooms.add(roomId);
          if (!rooms.has(roomId)) rooms.set(roomId, new Set());
          rooms.get(roomId)!.add(ws);

          return ws.send(JSON.stringify({ info: `Joined room ${roomId}` }));
        } catch (error) {
          console.log("Something went wrong while joining the room", error);
        }
      }

      case "chat": {
        if (!roomId || typeof message !== "string") {
          return ws.send(JSON.stringify({ error: "Need room and message" }));
        }
        if (!conn.rooms.has(roomId)) {
          return ws.send(JSON.stringify({ error: `Not in room ${roomId}` }));
        }

        try {
          await prismaClient.chat.create({
            data: {
              roomId: Number(roomId),
              message,
              userId: conn.userId,
            },
          });

          const payload = JSON.stringify({
            type: "chat",
            roomId,
            from: conn.userId,
            message,
          });
          for (const peerWs of rooms.get(roomId)!) {
            peerWs.send(payload);
          }
          return;
        } catch (error) {
          console.log("Something went wrong while sending chat", error)
        }
      }

      case "leave-room": {
        if (!roomId) {
          return ws.send(JSON.stringify({ error: "No room specified" }));
        }
        conn.rooms.delete(roomId);
        const set = rooms.get(roomId);
        if (set) {
          set.delete(ws);
          if (set.size === 0) rooms.delete(roomId);
        }
        return ws.send(JSON.stringify({ info: `Left room ${roomId}` }));
      }

      default:
        return ws.send(JSON.stringify({ error: `Unknown action: ${type}` }));
    }
  });

  ws.on("close", () => {
    const conn = connections.get(ws);
    if (!conn) return;

    for (const r of conn.rooms) {
      const set = rooms.get(r);
      if (set) {
        set.delete(ws);
        if (set.size === 0) rooms.delete(r);
      }
    }
    connections.delete(ws);
  });
});

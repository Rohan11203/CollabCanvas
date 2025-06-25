import { WebSocket, WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";

interface UserI {
  ws: WebSocket;
  rooms: Set<string>;
}

type UsersMap = Map<string, UserI>;

type RoomsMap = Map<string, Set<string>>;

const wss = new WebSocketServer({ port: 8080 });
const users: UsersMap = new Map();
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
  action: "join-room" | "chat" | "leave-room";
  room: string;
  message?: string;
};

wss.on("connection", (ws, req) => {
  const params = new URLSearchParams((req.url || "").split("?", 2)[1]);
  const userId = checkUser(params.get("token") || "");
  if (!userId) return ws.close(1008, "Authentication required");

  users.set(userId, { ws, rooms: new Set() });

  ws.on("message", async (raw) => {
    let msg: Message;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      return ws.send(JSON.stringify({ error: "Invalid JSON" }));
    }

    const { action, room, message } = msg;
    const user = users.get(userId)!;

    switch (action) {
      case "join-room": {
        if (!room)
          return ws.send(JSON.stringify({ error: "No room specified" }));
        const dbRoom = await prismaClient.room.findUnique({
          where: { slug: room },
        });
        if (!dbRoom)
          return ws.send(JSON.stringify({ error: "Room not found" }));

        user.rooms.add(room);
        if (!rooms.has(room)) rooms.set(room, new Set());
        rooms.get(room)!.add(userId);

        return ws.send(JSON.stringify({ info: `Joined room ${room}` }));
      }

      case "chat": {
        if (!room || typeof message !== "string")
          return ws.send(JSON.stringify({ error: "Need room and message" }));

        const memberSet = rooms.get(room);
        if (!memberSet || !memberSet.has(userId))
          return ws.send(JSON.stringify({ error: `Not in room ${room}` }));

        // chat in DB
        const dbRoom = await prismaClient.room.findUnique({
          where: { slug: room },
        });
        if (dbRoom) {
          await prismaClient.chat.create({
            data: {
              roomId: dbRoom.id,
              message,
              userId,
            },
          });
        }

        const payload = JSON.stringify({
          action: "chat",
          room,
          from: userId,
          message,
        });
        for (const peerId of memberSet) {
          users.get(peerId)?.ws.send(payload);
        }
        return;
      }

      case "leave-room": {
        if (!room)
          return ws.send(JSON.stringify({ error: "No room specified" }));
        user.rooms.delete(room);

        const memberSet = rooms.get(room);
        if (memberSet) {
          memberSet.delete(userId);
          if (memberSet.size === 0) rooms.delete(room);
        }

        return ws.send(JSON.stringify({ info: `Left room ${room}` }));
      }

      default:
        return ws.send(JSON.stringify({ error: `Unknown action: ${action}` }));
    }
  });

  ws.on("close", () => {
    const user = users.get(userId);
    if (!user) return;

    for (const slug of user.rooms) {
      const set = rooms.get(slug);
      if (set) {
        set.delete(userId);
        if (set.size === 0) rooms.delete(slug);
      }
    }
    users.delete(userId);
  });
});

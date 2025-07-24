import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt, { genSalt } from "bcryptjs";
import { Userauth } from "../auth";
import { JWT_SECRET } from "@repo/backend-common/config";
import {
  CreateRoomSchema,
  CreateUserSchema,
  SigninSchema,
} from "@repo/common/types";
import { prismaClient } from "@repo/db/client";

export const UserRouter: Router = Router();
UserRouter.post("/signup", async (req: any, res: any) => {
  const parsed = CreateUserSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Enter Valid Details",
      errors: parsed.error.errors.map((e) => e.message),
    });
  }

  const { username, email, password } = parsed.data;

  try {
    const existingUser = await prismaClient.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const salt = bcrypt.genSaltSync(5);
    const hashPassword = bcrypt.hashSync(password, salt);

    const user = await prismaClient.user.create({
      data: { email, password: hashPassword, username },
    });

    const payload = { sub: user.id.toString(), email: user.email };
    const token = jwt.sign(payload, JWT_SECRET);

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: false, // in production, set to true
        secure: false, // Needed for HTTPS (Render uses HTTPS)
        sameSite: "lax", // none for production
      })
      .json({
        success: true,
        message: "SignUp successful",
        token,
        user: { id: user.id, username: user.username, email: user.email },
      });
  } catch (error) {
    res.status(404).json({
      error: error,
    });
  }
});

UserRouter.post("/signin", async (req: any, res: any) => {
  const parsed = SigninSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Enter Valid Details",
      errors: parsed.error.errors.map((e) => e.message),
    });
  }

  const { email, password } = parsed.data;

  try {
    const user = await prismaClient.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.password) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    }

    const payload = { sub: user.id.toString(), email: user.email };
    const token = jwt.sign(payload, JWT_SECRET);

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: false, // in production, set to true
        secure: false, // Needed for HTTPS (Render uses HTTPS)
        sameSite: "lax", // none for production
      })
      .json({
        success: true,
        message: "Signin successful",
        token,
        user: { id: user.id, username: user.username, email: user.email },
      });
  } catch (error) {
    res.status(404).json({
      message: error,
    });
  }
});

UserRouter.post("/social-login", async (req: any, res: any) => {
  const { email, name } = req.body;

  console.log('reaching here')
  console.log(email,name)
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    let user = await prismaClient.user.findUnique({ where: { email } });

    if (!user) {
      user = await prismaClient.user.create({
        data: {
          email,
          username: name || email.split('@')[0],
        },
      });
    }

    const payload = { sub: user.id.toString(), email: user.email };
    const token = jwt.sign(payload, JWT_SECRET);

    return res.status(200).json({
      success: true,
      message: "Social login successful",
      token, 
      user: { id: user.id, username: user.username, email: user.email },
    });

  } catch (error) {
    console.error("Social login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

UserRouter.post("/create-room", Userauth, async (req: any, res: any) => {
  const parsed = CreateRoomSchema.safeParse(req.body);

  if (!parsed.success) {
    res.json({
      message: "Incorrect inputs",
    });
    return;
  }

  const { name } = parsed.data;

  const adminId: string = req.user.id;

  try {
    const room = await prismaClient.room.create({
      data: {
        slug: name,
        adminId,
      },
    });
    res.status(201).json({
      message: "Room created Successfully",
      room,
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      // This is a conflict because the room name (slug) already exists
      return res
        .status(409)
        .json({ message: "A room with this name already exists." });
    }

    console.error(error);
    return res.status(500).json({ message: "An internal error occurred." });
  }
});

UserRouter.get("/chats/:roomId", async (req, res) => {
  const roomId = Number(req.params.roomId);

  try {
    const messages = await prismaClient.chat.findMany({
      where: {
        roomId: roomId,
      },
      orderBy: {
        id: "desc",
      },
      take: 1000,
    });

    res.json({
      messages,
    });
  } catch (e) {
    console.log(e);
    res.json({
      messages: [],
    });
  }
});


UserRouter.get("/rooms", Userauth, async (req: any, res: any) => {
  try {
    const userId = req.user.id;

    const rooms = await prismaClient.room.findMany({
      where: {
        adminId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 4,
    });

    res.json({ rooms });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to fetch rooms" });
  }
});
UserRouter.get("/rooms/:name", async (req, res) => {
  try {
    const roomName = req.params.name;
    const room = await prismaClient.room.findMany({
      where: {
        slug: roomName,
      },
    });

    res.json({
      room,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: "internal server error",
    });
  }
});


import {
  NextFunction,
  request,
  Request,
  RequestHandler,
  Response,
} from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config"
export const Userauth: RequestHandler = (req:any, res, next) => {
  const authHeader = req.headers.authorization as string | undefined;
  const token =
    authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null;

  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded: any) => {
    if (err) {
      res.status(403).json({ message: 'Invalid or expired token' });
      return;
    }

    req.user = {
      id: decoded.sub || decoded.id,
      email: decoded.email,
      source: 'jwt',
    };

    next();
  });
};

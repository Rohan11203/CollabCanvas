import {
  NextFunction,
  request,
  Request,
  RequestHandler,
  Response,
} from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = "rohan";
export const Userauth: RequestHandler = (req:any, res, next) => {
  const authHeader = req.headers.authorization as string | undefined;
  const token =
    authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null;

  if (!token) {
    // 2️⃣ Send & return void
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded: any) => {
    if (err) {
      // 2️⃣ Send & return void
      res.status(403).json({ message: 'Invalid or expired token' });
      return;
    }

    // attach user to request
    req.user = {
      id: decoded.sub || decoded.id,
      email: decoded.email,
      source: 'jwt',
    };

    // 3️⃣ Call next() and return void
    next();
  });
};

import express, { Request, Response, Router } from "express";
import cookieParser from 'cookie-parser'
import { UserRouter } from "./routes";
import cors from "cors";
const app = express();
const PORT = 3001;

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/v1/user", UserRouter);

app.get("/", (req: Request, res: Response) => {
  res.send(`App is running `);
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

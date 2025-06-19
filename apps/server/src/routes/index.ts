import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt, { genSalt } from "bcryptjs";
import { Userauth } from "../auth";

export const UserRouter: Router = Router();
const JWT_SECRET = "rohan";

UserRouter.post("/signup", (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Db call to check if user Exist
    const salt = bcrypt.genSaltSync(5);
    const hashPassword = bcrypt.hashSync(password, salt);

    // Db call to store the data

    res.status(200).json({
      message: "SignUp successfull",
    });
  } catch (error) {
    res.status(404).json({
      message: error,
    });
  }
});

UserRouter.post("/signin", async (req: any, res: any) => {
  const { email, password } = req.body;

  try {
    // Db call
    const user = {
      _id: 1,
      email: "rohan@gmail.com",
      password: "123123",
    };
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = { sub: user._id.toString(), email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });

    res.status(200).json({
      message: "Signin successfull",
      token,
    });
  } catch (error) {
    res.status(404).json({
      message: error,
    });
  }
});

UserRouter.post("/create-room", Userauth, (req, res) => {
  res.json({
    roomId: 123,
  });
});

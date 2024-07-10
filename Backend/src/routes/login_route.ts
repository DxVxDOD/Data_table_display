import express, { Request, Response } from "express";
import { login } from "../services/login_service";

const route = express.Router();

route.post("/", async (req: Request, res: Response) => {
  const user = await login(req.body);

  if (user instanceof Error) {
    return res.status(401).json({ error: user.message });
  }

  return res.status(200).json(user);
});

export default route;

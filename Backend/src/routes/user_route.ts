import express, { Request, Response } from "express";
import { post_new_user } from "../services/user_service";

const route = express.Router();

route.post("/", async (req: Request, res: Response) => {
  const new_user = await post_new_user(req.body);

  if (new_user instanceof Error) {
    return res.status(400).json({ error: new_user.message });
  }

  return res.status(201).json("Sign-up was successful");
});

export default route;

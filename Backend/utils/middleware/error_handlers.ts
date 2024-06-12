import { type Response, type Request } from "express";

export function unknown_endpoint(_req: Request, res: Response) {
  res.status(404).send({ error: "Unknown Endpoint" });
}

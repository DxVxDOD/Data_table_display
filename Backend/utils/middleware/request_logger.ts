import { type NextFunction, type Request, type Response } from "express";
export function request_logger(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  console.log("Method: ", req.method);
  console.log("Path: ", req.path);
  console.log("Body: ", req.body);

  next();
}

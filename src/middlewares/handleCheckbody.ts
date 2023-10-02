import { NextFunction, Request, Response } from "express";
import AppError from "../errors/AppError";

const handleCheckbody =
  (notAllowedList: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    Object.keys(req.body).forEach((key) => {
      if (notAllowedList.includes(key)) {
        throw new AppError(`${key} is immutable`, 400);
      }
    });

    next();
  };

export default handleCheckbody;

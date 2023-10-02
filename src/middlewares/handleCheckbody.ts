import { NextFunction, Request, Response } from "express";

const AppError = require("../errors/AppError");

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

module.exports = handleCheckbody;

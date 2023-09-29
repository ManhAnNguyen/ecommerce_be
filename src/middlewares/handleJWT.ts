import { NextFunction, Request, Response } from "express";
import AppError from "../errors/AppError";
import jwt from "jsonwebtoken";
import { adminRepository, userRepository } from "../repositories";

async function handleJwt(
  req: Request & {
    admin: Record<string, unknown>;
    user: Record<string, unknown>;
  },
  res: Response,
  next: NextFunction
) {
  const token = req?.headers?.authorization?.split(" ")?.[1];

  if (!token) throw new AppError("Unauthorized", 401);

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN) as any;
  if (!decoded) throw new AppError("Unauthorized", 401);

  const { user_id, admin_id } = decoded;

  if (admin_id) {
    const findAdmin = await adminRepository.findOneBy({ admin_id });

    if (!findAdmin) throw new AppError("Unauthorized", 401);
    const { iat, exp, ...rest } = decoded;
    req.admin = {
      ...rest,
    };
  } else {
    const findUser = await userRepository.findOneBy({
      id: user_id,
    });

    if (!findUser) throw new AppError("Unauthorized", 401);
    const { iat, exp, ...rest } = decoded;

    req.user = {
      ...rest,
    };
  }

  next();
}

export default handleJwt;

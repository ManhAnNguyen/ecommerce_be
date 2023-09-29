import { NextFunction, Request, Response } from "express";
import AppError from "../errors/AppError";
import { adminRepository } from "../repositories";

const handleRole = async (
  req: Request & {
    admin: Record<string, unknown>;
  },
  res: Response,
  next: NextFunction
) => {
  const admin = req.admin;
  if (!admin) throw new AppError("no permission", 403);

  const { admin_id } = req.admin;

  const infoAdmin = await adminRepository.findOneBy({
    admin_id: admin_id as string,
  });

  if (!infoAdmin) throw new AppError("no permission", 403);
  next();
};

export default handleRole;

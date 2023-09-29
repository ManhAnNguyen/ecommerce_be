import { Request, Response } from "express";
import AdminService from "../services/admin";

const adminService = new AdminService();

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const accessToken = await adminService.login(username, password);
  res.status(200).json(accessToken);
};

const lockedUser = async (req: Request, res: Response) => {
  const { id, locked } = req.body;

  await adminService.lockedUser(id, locked);
  res.sendStatus(200);
};

export { login, lockedUser };

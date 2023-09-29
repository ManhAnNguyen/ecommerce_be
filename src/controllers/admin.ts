import { Request, Response } from "express";
import AdminService from "../services/admin";

const adminService = new AdminService();

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const accessToken = await adminService.login(username, password);
  res.status(200).json(accessToken);
};

export { login };

import { Request, Response } from "express";
import UserService from "../services/users";

const userService = new UserService();

const getDetailUser = async (req: Request, res: Response) => {
  const { id: user_id } = req.params;

  const result = await userService.getDetailUser(user_id);

  res.status(200).json(result);
};

const getAllUser = async (req: Request, res: Response) => {
  const result = await userService.getAllUser();

  res.status(200).json(result);
};

export { getDetailUser, getAllUser };

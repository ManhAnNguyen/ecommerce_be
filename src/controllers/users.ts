import { Request, Response } from "express";
import UserService from "../services/users";

const userService = new UserService();

const getDetailUser = async (req: Request, res: Response) => {
  const { id: user_id } = req.params;

  const result = await userService.getDetailUser(user_id);

  res.status(200).json(result);
};

const updateUser = async (
  req: Request & {
    user: Record<string, unknown>;
  },
  res: Response
) => {
  const file = req.file;
  const avatar = file && `/${file.fieldname}/${file.filename}`;
  const { user_id } = req.user;
  const { username, email, phone, gender, birthday } = req.body;
  const data = { username, email, phone, gender, birthday, avatar };
  await userService.updateUser(data, user_id as string);
  res.sendStatus(200);
};

const getAllUser = async (req: Request, res: Response) => {
  const result = await userService.getAllUser();

  res.status(200).json(result);
};

const getMe = async (
  req: Request & {
    user: Record<string, unknown>;
  },
  res: Response
) => {
  const { user_id } = req.user;

  const result = await userService.getDetailUser(user_id as number);

  res.status(200).json(result);
};

const createAddress = async (
  req: Request & {
    user: Record<string, unknown>;
  },
  res: Response
) => {
  const { districtCode, provinceCode, communeCode } = req.body;
  const { user_id } = req.user;
  await userService.createAddress(
    user_id as string,
    districtCode,
    provinceCode,
    communeCode
  );
  res.sendStatus(201);
};

const updateAddress = async (req: Request, res: Response) => {
  const { districtCode, provinceCode, communeCode } = req.body;
  await userService.updateAddress(
    req.params.id,
    districtCode,
    provinceCode,
    communeCode
  );
  res.sendStatus(200);
};

const deleteAddress = async (req: Request, res: Response) => {
  await userService.deleteAddress(req.params.id);
  res.sendStatus(204);
};

const setDefaultAddress = async (req: Request, res: Response) => {
  await userService.setDefaultAddress(req.params.id);
  res.sendStatus(200);
};

export {
  getDetailUser,
  getAllUser,
  getMe,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  updateUser,
};

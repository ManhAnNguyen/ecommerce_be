import { Request, Response } from "express";
import { UserService } from "../services/auth";
import moment from "moment";

const userService = new UserService();

const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  await userService.register(username, password);
  res.sendStatus(200);
};

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const { refreshToken, accessToken } = await userService.login(
    username,
    password
  );
  res.cookie("refreshToken", refreshToken, {
    // secure: true,
    httpOnly: true,
    expires: moment().add("1", "day").toDate(),
  });
  res.status(200).json(accessToken);
};

const refreshToken = async (req: Request, res: Response) => {
  const accessToken = await userService.refreshToken(req);
  res.status(200).json(accessToken);
};

const logout = async (req: Request, res: Response) => {
  await userService.logout(req, res);
  res.clearCookie("refreshToken");
  res.sendStatus(200);
};

const changePassword = async (req: Request, res: Response) => {};

export { register, login, refreshToken, logout, changePassword };

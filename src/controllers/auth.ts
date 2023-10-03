import { Request, Response } from "express";
import { AuthService } from "../services/auth";
import moment from "moment";

const authService = new AuthService();

const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  await authService.register(username, password);
  res.sendStatus(200);
};

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const { refreshToken, accessToken } = await authService.login(
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
  const accessToken = await authService.refreshToken(req);
  res.status(200).json(accessToken);
};

const logout = async (req: Request, res: Response) => {
  await authService.logout(req, res);
  res.clearCookie("refreshToken");
  res.sendStatus(200);
};

const changePassword = async (
  req: Request & {
    user: Record<string, unknown>;
  },
  res: Response
) => {
  const { currentPassword, newPassword } = req.body;
  const { user_id } = req.user;
  await authService.changePassword(
    currentPassword,
    newPassword,
    user_id as string
  );
  res.sendStatus(200);
};

export { register, login, refreshToken, logout, changePassword };

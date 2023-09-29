import AppError from "../errors/AppError";
import { AppDataSource } from "../data-source";
import { userRepository } from "../repositories";
import bcrypt from "bcrypt";
import { ACCESS_TOKEN, HASH_PWD, REFRESH_TOKEN } from "../config/env";
import { User } from "../entity/User";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

export class UserService {
  //register
  async register(username: string, password: string) {
    if (!username || !password) {
      throw new AppError("username and password are required", 400);
    }

    const existingUser = await userRepository.findOneBy({
      username,
    });

    if (existingUser) throw new AppError("username is not available", 409);
    const hashedPwd = bcrypt.hashSync(password, HASH_PWD);

    const user = new User();

    user.username = username;
    user.password = hashedPwd;

    await userRepository.save(user);
  }
  //login
  async login(username: string, password: string) {
    if (!username || !password) {
      throw new AppError("username and password are required", 400);
    }
    const user = await userRepository.findOneBy({
      username,
    });

    if (!user) throw new AppError("username or password is not correct", 404);

    if (user.locked) throw new AppError("your account is locked", 403);
    const comparePwd = bcrypt.compareSync(password, user.password);

    if (!comparePwd)
      throw new AppError("username or password is not correct", 404);

    const infoUser = {
      user_id: user.id,
      username: user.username,
    };

    //create token and send to client
    const accessToken = jwt.sign(infoUser, ACCESS_TOKEN, {
      expiresIn: "1d",
    });

    //create refresh token and save in db and send to client via cookie
    const refreshToken = jwt.sign(infoUser, REFRESH_TOKEN, {
      expiresIn: "2d",
    });

    user.refreshToken = refreshToken;

    await userRepository.save(user);

    return { refreshToken, accessToken };
  }
  //refreshToken
  async refreshToken(req: Request) {
    const { refreshToken } = req.cookies || {};
    if (!refreshToken) throw new AppError("must be provide refreshToken", 400);
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN) as {
      user_id: string;
    };

    if (!decoded) throw new AppError("incorrect refreshToken", 400);

    const existingUser = await userRepository.findOneBy({
      id: decoded.user_id,
    });

    if (!existingUser) throw new AppError("incorrect refreshToken", 400);
    const infoUser = {
      user_id: existingUser.id,
      username: existingUser.username,
    };
    const accessToken = jwt.sign(infoUser, ACCESS_TOKEN, {
      expiresIn: "1d",
    });

    return accessToken;
  }
  //logout
  async logout(req: Request, res: Response) {
    //FE also delete token in localstorage
    const { refreshToken } = req.cookies || {};
    if (!refreshToken) return res.sendStatus(200);
    //clear refresh token in db
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN) as {
      user_id: string;
    };
    if (!decoded) return res.sendStatus(200);

    const user = await userRepository.findOneBy({
      id: decoded.user_id,
    });
    if (!user) return res.sendStatus(200);
    user.refreshToken = null;
    await userRepository.save(user);
  }
  //change password
  async changePassword(
    currentPassword: string,
    newPassword: string,
    user_id: string
  ) {
    if (!currentPassword || !newPassword)
      throw new AppError("currentPassword and newPassword are required", 400);
    const user = await userRepository.findOneBy({ id: user_id });
    const comparePwd = bcrypt.compareSync(currentPassword, user.password);
    if (!comparePwd) throw new AppError("Current password is not correct", 400);

    const hashedPwd = bcrypt.hashSync(newPassword, HASH_PWD);

    user.password = hashedPwd;
    await userRepository.save(user);
  }
}

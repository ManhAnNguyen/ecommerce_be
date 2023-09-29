import { ACCESS_TOKEN } from "../config/env";
import AppError from "../errors/AppError";
import { adminRepository } from "../repositories";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AdminService {
  //login
  async login(username: string, password: string) {
    if (!username || !password) {
      throw new AppError("username and password are required", 400);
    }
    const admin = await adminRepository.findOneBy({
      username,
    });
    if (!admin) throw new AppError("username or password is not correct", 404);
    const comparePwd = bcrypt.compareSync(password, admin.password);
    if (!comparePwd)
      throw new AppError("username or password is not correct", 404);
    const infoAdmin = {
      admin_id: admin.admin_id,
      username: admin.username,
    };

    //create token and send to client
    const accessToken = jwt.sign(infoAdmin, ACCESS_TOKEN, {
      expiresIn: "1d",
    });

    return accessToken;
  }
}

export default AdminService;
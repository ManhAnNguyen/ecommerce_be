import { ACCESS_TOKEN, HASH_PWD } from "../config/env";
import { Admin } from "../entity/Admin";
import AppError from "../errors/AppError";
import { adminRepository, userRepository } from "../repositories";
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
  //locked user
  async lockedUser(id: string, locked: boolean) {
    if (!id) throw new AppError("id must be required", 400);
    const user = await userRepository.findOneBy({ id });
    if (!user) throw new AppError("user not found", 400);

    user.locked = locked;
    await userRepository.save(user);
  }

  //create
  async create(username: string, password: string) {
    if (!username || !password) {
      throw new AppError("username and password are required", 400);
    }
    const admin = new Admin();
    const hashedPwd = bcrypt.hashSync(password, HASH_PWD);

    admin.password = hashedPwd;
    admin.username = username;

    await adminRepository.save(admin);
  }
}

export default AdminService;

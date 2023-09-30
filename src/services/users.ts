import AppError from "../errors/AppError";
import { userRepository } from "../repositories";

class UserService {
  async getDetailUser(id: string | number) {
    if (!id) throw new AppError("id must be required", 400);
    const user = await userRepository.findOne({
      where: {
        id,
      },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        gender: true,
        birthday: true,
        created_at: true,
        updated_at: true,
        locked: true,
        avatar: true,
        userAddress: true,
        userBanks: true,
      },
      relations: {
        userAddress: {
          commune: true,
          province: true,
          district: true,
        },
        userBanks: true,
      },
    });

    return user;
  }
  async getAllUser() {
    const result = await userRepository.find({
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        gender: true,
        birthday: true,
        created_at: true,
        updated_at: true,
        locked: true,
        avatar: true,
        userAddress: true,
      },
      relations: {
        userAddress: {
          commune: true,
          province: true,
          district: true,
        },
      },
    });

    return result;
  }
}

export default UserService;

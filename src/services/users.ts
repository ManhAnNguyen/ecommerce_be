import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import UserAddress from "../entity/UserAddress";
import AppError from "../errors/AppError";
import {
  communeRepository,
  districtRepository,
  provinceRepository,
  userAddressRepository,
  userRepository,
} from "../repositories";

class UserService {
  //check address
  private async checkAddress(
    districtCode: string,
    provinceCode: string,
    communeCode: string
  ) {
    if (!districtCode || !provinceCode || !communeCode)
      throw new AppError(
        "districtCode,provinceCode,communeCode are required",
        400
      );

    const province = await provinceRepository.findOneBy({ code: provinceCode });
    if (!province) throw new AppError("province not found", 404);
    const district = await districtRepository.findOneBy({
      code: districtCode,
      province,
    });
    if (!district) throw new AppError("district not found", 404);

    const commune = await communeRepository.findOneBy({
      code: communeCode,
      district,
    });

    if (!commune) throw new AppError("commune not found", 404);

    return { province, district, commune };
  }
  //check existing address
  private async checkExistingAddress(id: string | number) {
    const userAddress = await userAddressRepository.findOneBy({ id });

    if (!userAddress) throw new AppError("address not found", 404);

    return userAddress;
  }

  async updateUser(data: Record<string, unknown>, user_id: string | number) {
    const user = await userRepository.findOneBy({ id: user_id });

    for (let key in data) {
      if (!!data[key]) {
        user[key] = data[key];
      }
    }

    await userRepository.save(user);
  }

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
        statisticUser: {
          total_item_order: true,
          total_price: true,
        },
      },
      relations: {
        userAddress: {
          commune: true,
          province: true,
          district: true,
        },
        userBanks: true,
        statisticUser: true,
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
  //address
  async createAddress(
    user_id: string,
    districtCode: string,
    provinceCode: string,
    communeCode: string
  ) {
    const { commune, district, province } = await this.checkAddress(
      districtCode,
      provinceCode,
      communeCode
    );

    const user = await userRepository.findOneBy({ id: user_id });

    const userAddress = new UserAddress();
    userAddress.commune = commune;
    userAddress.district = district;
    userAddress.province = province;
    userAddress.user = user;
    await userAddressRepository.save(userAddress);
  }

  async updateAddress(
    id: string,
    districtCode: string,
    provinceCode: string,
    communeCode: string
  ) {
    const userAddress = await this.checkExistingAddress(id);
    const { commune, district, province } = await this.checkAddress(
      districtCode,
      provinceCode,
      communeCode
    );

    userAddress.commune = commune;
    userAddress.district = district;
    userAddress.province = province;
    await userAddressRepository.save(userAddress);
  }

  async deleteAddress(id: string | number) {
    const userAddress = await this.checkExistingAddress(id);
    await userAddressRepository.delete({
      id: userAddress.id,
    });
  }

  async setDefaultAddress(id: string | number) {
    const userAddress = await this.checkExistingAddress(id);
    const addressDefault = await userAddressRepository.findOneBy({
      isDefault: true,
    });

    await AppDataSource.manager.transaction(
      async (transactionalEntityManager) => {
        userAddress.isDefault = true;
        const entityUserAddress =
          transactionalEntityManager.getRepository(UserAddress);

        await entityUserAddress.save(userAddress);

        if (addressDefault) {
          addressDefault.isDefault = false;
          await entityUserAddress.save(addressDefault);
        }
      }
    );
  }
}

export default UserService;

import { AppDataSource } from "../data-source";
import { Admin } from "../entity/Admin";
import Banks from "../entity/Bank";
import Commune from "../entity/Commune";
import District from "../entity/District";
import Province from "../entity/Province";
import { User } from "../entity/User";
import UserAddress from "../entity/UserAddress";
import UserBank from "../entity/UserBank";

const userRepository = AppDataSource.getRepository<User>(User);
const adminRepository = AppDataSource.getRepository<Admin>(Admin);
const provinceRepository = AppDataSource.getRepository<Province>(Province);
const districtRepository = AppDataSource.getRepository<District>(District);
const communeRepository = AppDataSource.getRepository<Commune>(Commune);
const userAddressRepository =
  AppDataSource.getRepository<UserAddress>(UserAddress);
const bankRepository = AppDataSource.getRepository<Banks>(Banks);
const userBankRepository = AppDataSource.getRepository<UserBank>(UserBank);

export {
  userRepository,
  adminRepository,
  provinceRepository,
  districtRepository,
  communeRepository,
  userAddressRepository,
  bankRepository,
  userBankRepository,
};

import { AppDataSource } from "../data-source";
import { Admin } from "../entity/Admin";
import Commune from "../entity/Commune";
import District from "../entity/District";
import Province from "../entity/Province";
import { User } from "../entity/User";

const userRepository = AppDataSource.getRepository<User>(User);
const adminRepository = AppDataSource.getRepository<Admin>(Admin);
const provinceRepository = AppDataSource.getRepository<Province>(Province);
const districtRepository = AppDataSource.getRepository<District>(District);
const communeRepository = AppDataSource.getRepository<Commune>(Commune);

export {
  userRepository,
  adminRepository,
  provinceRepository,
  districtRepository,
  communeRepository,
};

import { AppDataSource } from "../data-source";
import { Admin } from "../entity/Admin";
import { User } from "../entity/User";

const userRepository = AppDataSource.getRepository<User>(User);
const adminRepository = AppDataSource.getRepository<Admin>(Admin);

export { userRepository, adminRepository };

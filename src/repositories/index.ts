import { AppDataSource } from "../data-source";
import { Admin } from "../entity/Admin";
import Banks from "../entity/Bank";
import Category from "../entity/Category";
import Commune from "../entity/Commune";
import District from "../entity/District";
import OrderItems from "../entity/OrderItems";
import Orders from "../entity/Orders";
import PaymentMethod from "../entity/PaymentMethod";
import Products from "../entity/Product";
import Province from "../entity/Province";
import ReviewProduct from "../entity/ReviewProduct";
import StatisticUser from "../entity/StatisticUser";
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
const categoryRepository = AppDataSource.getRepository<Category>(Category);
const productRepository = AppDataSource.getRepository<Products>(Products);
const reviewProductRepository =
  AppDataSource.getRepository<ReviewProduct>(ReviewProduct);
const orderRespository = AppDataSource.getRepository<Orders>(Orders);
const orderItemsRepository =
  AppDataSource.getRepository<OrderItems>(OrderItems);

const statisticUserRepository =
  AppDataSource.getRepository<StatisticUser>(StatisticUser);
const paymentMethodRepository =
  AppDataSource.getRepository<PaymentMethod>(PaymentMethod);

export {
  categoryRepository,
  productRepository,
  reviewProductRepository,
  orderItemsRepository,
  orderRespository,
  statisticUserRepository,
  paymentMethodRepository,
  userRepository,
  adminRepository,
  provinceRepository,
  districtRepository,
  communeRepository,
  userAddressRepository,
  bankRepository,
  userBankRepository,
};

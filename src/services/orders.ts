import {
  statusAllowedApprovedRejected,
  statusAllowedRetrieveOrRejectedCanceling,
  statusAllowedUserCanceling,
  statusAllowedUserConfirmShip,
} from "../constants";
import { EConfigStatusOrder } from "../constants/enum";
import { AppDataSource } from "../data-source";
import OrderItems from "../entity/OrderItems";
import Orders from "../entity/Orders";
import Products from "../entity/Product";
import StatisticUser from "../entity/StatisticUser";
import { User } from "../entity/User";
import UserAddress from "../entity/UserAddress";
import AppError from "../errors/AppError";
import { removePropertiesEmpty } from "../helpers";
import Pagination from "../instance/Pagination";
import {
  orderItemsRepository,
  orderRespository,
  paymentMethodRepository,
  productRepository,
  userAddressRepository,
  userRepository,
} from "../repositories";
import UserService from "./users";

const userService = new UserService();

class OrderService {
  //check existing order
  private async checkExistingOrder(id: string | number) {
    const order = await orderRespository.findOneBy({ id });
    if (!order) throw new AppError("order not found", 404);
    return order;
  }
  //create
  async create(
    data: Record<"address_id" | "payment_method_id" | "user_id", string> & {
      products: {
        id: string;
        qty: string;
      }[];
    }
  ) {
    const { payment_method_id, products, user_id, address_id } = data;
    if (!payment_method_id || !products || !address_id)
      throw new AppError("payment method,products,address required", 400);
    const user = await userRepository.findOneBy({ id: user_id });
    const address = await userService.checkExistingUserAddress(address_id);

    const paymentMethod = await paymentMethodRepository.findOneBy({
      id: payment_method_id,
    });

    if (!paymentMethod) throw new AppError("paymentMethod not found", 404);

    const order = new Orders();
    order.address = address;
    order.user = user;
    order.paymentMethod = paymentMethod;

    await AppDataSource.transaction(async (entity) => {
      const order = new Orders();
      order.address = address;
      order.user = user;
      order.paymentMethod = paymentMethod;

      const createdOrder = await entity.getRepository(Orders).save(order);
      const orderItems = [];
      await (() => {
        return new Promise((resolve, reject) => {
          products.forEach(async ({ id, qty }, index) => {
            const orderItem = new OrderItems();
            const product = await productRepository.findOneBy({ id });
            orderItem.quantity = +qty;
            orderItem.product = product;
            orderItem.order = createdOrder;
            orderItems.push(orderItem);

            if (index === products.length - 1) {
              resolve(1);
            }
          });
        });
      })();

      await entity
        .createQueryBuilder()
        .insert()
        .into(OrderItems)
        .values(orderItems)
        .execute();
    });
  }

  //get
  async get(
    user_id: string | number,
    meta: {
      page: number;
      take: number;
    },
    status?: EConfigStatusOrder
  ) {
    const [docs, total] = await orderRespository.findAndCount({
      where: removePropertiesEmpty({
        user: {
          id: user_id,
        },
        status,
      }),
      select: {
        user: {
          id: true,
          username: true,
          avatar: true,
        },
        products: {
          quantity: true,
        },
      },
      relations: {
        user: true,
        paymentMethod: true,
        products: {
          product: true,
        },
        address: {
          commune: true,
          district: true,
          province: true,
        },
      },
    });

    const metadata = new Pagination(total, meta.page, meta.take);
    return { docs, metadata };
  }

  //cancel order
  async cancelOrder(id: string | number) {
    const order = await this.checkExistingOrder(id);
    if (
      !statusAllowedUserCanceling.find((_status) => _status === order.status)
    ) {
      throw new AppError("your order is not able to cancel", 403);
    }

    if (order.status === EConfigStatusOrder.PENDING) {
      order.status = EConfigStatusOrder.CANCELED;
      await orderRespository.save(order);
      return "your account is canceled";
    } else {
      order.status = EConfigStatusOrder.CANCELING;
      await orderRespository.save(order);
      return "waiting for approved cancel";
    }
  }

  //retrieve cancel order
  async retrieveCancelOrder(id: string | number) {
    const order = await this.checkExistingOrder(id);
    if (
      !statusAllowedRetrieveOrRejectedCanceling.find(
        (status) => status === order.status
      )
    ) {
      throw new AppError("only status canceling to able retrieve cancel", 403);
    }

    order.status = EConfigStatusOrder.APPROVED;
    await orderRespository.save(order);
  }
  //change status
  async changeStatus(id: string | number, status: EConfigStatusOrder) {
    const order = await this.checkExistingOrder(id);

    if (
      !Object.values(EConfigStatusOrder).find((_status) => _status === status)
    ) {
      throw new AppError(
        `status accept in ${JSON.stringify(EConfigStatusOrder)}`,
        400
      );
    }

    //if reject or approved order : pending
    if (
      (status === EConfigStatusOrder.APPROVED ||
        status === EConfigStatusOrder.REJECTED) &&
      !statusAllowedApprovedRejected.find((_status) => _status === order.status)
    ) {
      throw new AppError(
        "can not reject or arpprove order is not pending",
        400
      );
    }

    //if reject or arrprove cancel order
    if (
      (status === EConfigStatusOrder.CANCELED ||
        status === EConfigStatusOrder.REJECTED_CANCEL) &&
      !statusAllowedRetrieveOrRejectedCanceling.find(
        (_status) => _status === order.status
      )
    ) {
      throw new AppError("can not reject or arpprove canceling'order ", 400);
    }

    order.status = status;
    await orderRespository.save(order);
  }
  //confirm ship
  async confirmShip(id: string | number, user_id: string | number) {
    const order = await this.checkExistingOrder(id);

    if (
      !statusAllowedUserConfirmShip.find((status) => status === order.status)
    ) {
      throw new AppError("your order is not allowed to confirm ship", 400);
    }

    await AppDataSource.transaction(async (entityManager) => {
      //change status
      order.status = EConfigStatusOrder.SHIPPED;
      await entityManager.getRepository(Orders).save(order);

      //add to statisticUser

      const { totalQty, totalPrice } = await entityManager
        .getRepository(OrderItems)
        .createQueryBuilder("orderItems")
        .leftJoinAndSelect("orderItems.product", "product")
        .where("orderId = :orderId", { orderId: order.id })
        .select(
          `SUM(orderItems.quantity) as totalQty,
          SUM(orderItems.quantity * product.price) as totalPrice`
        )
        .groupBy("orderItems.orderId")
        .getRawOne();

      const user = await entityManager
        .getRepository(User)
        .findOneBy({ id: user_id });

      const { total_price, total_item_order } =
        (await entityManager.getRepository(StatisticUser).findOneBy({
          user_id,
        })) || {};
      const statisticUser = new StatisticUser();

      statisticUser.total_price = +(total_price || 0) + +totalPrice;
      statisticUser.total_item_order = +(total_item_order || 0) + +totalQty;
      statisticUser.user = user;

      await entityManager
        .getRepository(StatisticUser)
        .upsert(statisticUser, ["user_id"]);
    });
  }
}

export default OrderService;

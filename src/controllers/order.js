const {
  ConfigStatusOrder,
  statusAllowedApprovedRejected,
  statusAllowedCanceling,
  statusAllowedCanceledOrRejected,
} = require("../constants/user");
const AppError = require("../errors/AppError");
const orderService = require("../services/order.service");
const moment = require("moment");
const db = require("../services/db.service");
const userService = require("../services/user.service");

const create = async (req, res) => {
  const { user_id } = req.user;
  const { payment_method_id, address_id, products } = req.body;

  if (!payment_method_id || !address_id || !products || products.length === 0)
    throw new AppError("[payment method,address,product] are required", 400);

  const { insertId: orderId } = await orderService.create({
    user_id,
    address_id,
    payment_method_id,
    status: ConfigStatusOrder.PENDING,
    created_at: moment().toDate(),
  });

  products.forEach(async ({ id, qty }) => {
    await orderService.insertProduct(id, qty, orderId);
  });

  res.sendStatus(201);
};

const get = async (req, res) => {
  const { user_id } = req.user;
  const {
    page: _page,
    take: _take,
    order_by,
    sort_by,
    status_order,
  } = req.query;
  const page = +(_page || "1");
  const take = +(_take || "10");

  let filter = "";

  if (status_order) {
    filter = `AND status = '${status_order}'`;
  }

  const limit = `${(page - 1) * take},${take * page}`;

  const total = (
    await db.query(
      `SELECT count(*) as total from orders where orders.user_id = ? ${filter}`,
      [user_id]
    )
  )[0].total;

  const docs = await orderService.get(user_id, {
    limit,
    order_by,
    sort_by,
    filter,
  });

  res.status(200).json({
    docs,
    metadata: {
      page,
      take,
      total,
      hasNextPage: Math.ceil(total / take) > page,
      hasPreviousPage: page > 1,
    },
  });
};

const changeStatus = async (req, res) => {
  const { id, status } = req.body;

  if (!id || !status) throw new AppError("id and status are required", 400);
  if (!Object.values(ConfigStatusOrder).find((s) => s === status))
    throw new AppError(`status is not valid`, 400);
  const findOrder = await orderService.findOrder(id);
  if (!findOrder) throw new AppError("order not found", 404);

  //approve or reject
  if (
    (status === ConfigStatusOrder.APPROVED ||
      status === ConfigStatusOrder.REJECTED) &&
    !statusAllowedApprovedRejected.find((s) => s === findOrder.status)
  ) {
    throw new AppError("Can not approved or reject order is not pending", 400);
  }
  //approved or reject cancel order

  if (
    (status === ConfigStatusOrder.CANCELED ||
      status === ConfigStatusOrder.REJECTED_CANCEL) &&
    !statusAllowedCanceledOrRejected.find((s) => s === findOrder.status)
  ) {
    throw new AppError(
      "Can not approved or reject cancel order is not canceling",
      400
    );
  }

  //change status
  await orderService.changeStatus(id, status);

  res.sendStatus(200);
};
const cancelOrder = async (req, res) => {
  const { id } = req.body;

  const { user_id } = req.user || {};
  if (!id) throw new AppError("id are required", 400);
  const findOrder = await orderService.findOrder(id);

  if (!findOrder) throw new AppError("order not found", 404);
  if (user_id !== findOrder.user_id) throw new AppError("forbidden", 403);

  if (!statusAllowedCanceling.find((s) => s === findOrder.status)) {
    throw new AppError("can not cancel order", 400);
  }

  if (findOrder.status === ConfigStatusOrder.PENDING) {
    await orderService.changeStatus(id, ConfigStatusOrder.CANCELED);
    res.sendStatus(200);
  } else {
    await orderService.changeStatus(id, ConfigStatusOrder.CANCELING);
    res.status(200).json("waiting for approved cancel order");
  }
};

const retrieveCancelOrder = async (req, res) => {
  const { id } = req.body;

  const { user_id } = req.user || {};

  if (!id) throw new AppError("id are required", 400);
  const findOrder = await orderService.findOrder(id);

  if (!findOrder) throw new AppError("order not found", 404);
  if (user_id !== findOrder.user_id) throw new AppError("forbidden", 403);

  if (findOrder.status !== ConfigStatusOrder.CANCELING) {
    throw new AppError("order is not canceling", 400);
  }

  await orderService.changeStatus(id, ConfigStatusOrder.APPROVED);
  res.sendStatus(200);
};
const confirmShip = async (req, res) => {
  const { id } = req.body;

  const { user_id } = req.user || {};

  if (!id) throw new AppError("id are required", 400);
  const findOrder = await orderService.findOrder(id);

  if (!findOrder) throw new AppError("order not found", 404);
  if (user_id !== findOrder.user_id) throw new AppError("forbidden", 403);
  if (findOrder.status !== ConfigStatusOrder.APPROVED) {
    throw new AppError("order is not allowed to shipped", 400);
  }

  const { total_item_order, total_price_order } =
    (
      await db.query(`SELECT * FROM statistic_user WHERE user_id = ?`, [
        user_id,
      ])
    )[0] || {};

  const { total, qty } = (
    await orderService.getStatisticOrder(findOrder.id)
  )[0];

  await userService.updateStatistic(
    user_id,
    total_item_order ? +total + total_item_order : total,
    total_price_order ? +qty + total_price_order : qty
  );
  await orderService.changeStatus(id, ConfigStatusOrder.SHIPPED);
  res.sendStatus(200);
};

module.exports = {
  create,
  get,
  changeStatus,
  cancelOrder,
  retrieveCancelOrder,
  confirmShip,
};

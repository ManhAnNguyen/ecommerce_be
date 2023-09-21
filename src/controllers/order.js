const { ConfigStatusOrder } = require("../constants/user");
const AppError = require("../errors/AppError");
const orderService = require("../services/order.service");
const moment = require("moment");
const db = require("../services/db.service");

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

module.exports = { create, get };

import { Request, Response } from "express";
import OrderService from "../services/orders";
import { EConfigStatusOrder, EDefaultPagination } from "../constants/enum";

const orderService = new OrderService();

const create = async (
  req: Request & {
    user: Record<string, unknown>;
  },
  res: Response
) => {
  const { user_id } = req.user;
  await orderService.create({ ...req.body, user_id });
  res.sendStatus(201);
};

const get = async (
  req: Request & {
    user: Record<string, unknown>;
  },
  res: Response
) => {
  const { user_id } = req.user;
  const { take: _take, page: _page, status } = req.query;
  const take = +(_take || EDefaultPagination.TAKE);
  const page = +(_page || EDefaultPagination.PAGE);

  const data = await orderService.get(
    user_id as string,
    { page, take },
    status as EConfigStatusOrder
  );

  res.status(200).json(data);
};

const cancelOrder = async (req: Request, res: Response) => {
  const { id } = req.body;
  const message = await orderService.cancelOrder(id);
  res.status(200).json(message);
};

const retrieveCancelOrder = async (req: Request, res: Response) => {
  const { id } = req.body;
  await orderService.retrieveCancelOrder(id);
  res.sendStatus(200);
};

const changeStatus = async (req: Request, res: Response) => {
  const { id, status } = req.body;
  await orderService.changeStatus(id, status);
  res.sendStatus(200);
};

const confirmShip = async (
  req: Request & {
    user: Record<string, unknown>;
  },
  res: Response
) => {
  const { id } = req.body;
  await orderService.confirmShip(id, req.user.user_id as string);
  res.sendStatus(200);
};

export {
  create,
  get,
  cancelOrder,
  retrieveCancelOrder,
  changeStatus,
  confirmShip,
};

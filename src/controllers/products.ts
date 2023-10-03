import { Request, Response } from "express";
import ProductService from "../services/products";
import { Multer } from "multer";
import { EDefaultPagination, EDefaultSort } from "../constants/enum";

const productService = new ProductService();

const get = async (req: Request, res: Response) => {
  const {
    take: _take,
    page: _page,
    sort_by: _sortBy,
    order_by: _orderBy,
    ...rest
  } = req.query;
  const take = +(_take || EDefaultPagination.TAKE);
  const page = +(_page || EDefaultPagination.PAGE);
  const sort_by = (_sortBy || EDefaultSort.SORT_BY) as string;
  const order_by = (_orderBy || EDefaultSort.ORDER_BY) as string;

  const data = await productService.get(
    { take, page },
    { order_by, sort_by },
    rest
  );
  res.status(200).json(data);
};

const create = async (
  req: Request & {
    file: Express.Multer.File;
  },
  res: Response
) => {
  const image = req.file;
  const { name, price, category_id } = req.body;
  await productService.create(name, price, category_id, image);
  res.sendStatus(201);
};

const update = async (req: Request, res: Response) => {
  const image = req.file;
  const imageDestination = image?.destination?.split?.("/");
  const fileName =
    imageDestination &&
    `/${imageDestination[imageDestination.length - 1]}/${image.filename}`;

  await productService.update(req.params.id, { ...req.body, image: fileName });
  res.sendStatus(200);
};

const hiddenProduct = async (req: Request, res: Response) => {
  const { id, hidden } = req.body;
  await productService.hiddenProduct(id, hidden);
  res.sendStatus(200);
};

const getReview = async (req: Request, res: Response) => {
  const data = await productService.getReview(req.params.productId);
  res.status(200).json(data);
};

const createReview = async (
  req: Request & {
    user: Record<string, unknown>;
  },
  res: Response
) => {
  const { user_id } = req.user;
  const { productId } = req.params;
  const image = req.file;
  const imageDestination = image?.destination?.split?.("/");
  const fileName =
    imageDestination &&
    `/${imageDestination[imageDestination.length - 1]}/${image.filename}`;

  await productService.createReview(productId, user_id as string, {
    ...req.body,
    image: fileName,
  });

  res.sendStatus(201);
};

const updateReview = async (
  req: Request & {
    user: Record<string, unknown>;
  },
  res: Response
) => {
  const { reviewId } = req.params;
  const { user_id } = req.user;
  const image = req.file;
  const imageDestination = image?.destination?.split?.("/");
  const fileName =
    imageDestination &&
    `/${imageDestination[imageDestination.length - 1]}/${image.filename}`;

  await productService.updateReview(reviewId, user_id as string, {
    ...req.body,
    image: fileName,
  });
  res.sendStatus(200);
};

const deleteReview = async (
  req: Request & {
    user: Record<string, unknown>;
  },
  res: Response
) => {
  const { reviewId } = req.params;
  const { user_id } = req.user;
  await productService.deleteReview(reviewId, user_id as string);
  res.sendStatus(200);
};

export {
  get,
  create,
  update,
  hiddenProduct,
  getReview,
  createReview,
  updateReview,
  deleteReview,
};

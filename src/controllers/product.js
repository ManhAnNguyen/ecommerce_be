const db = require("../services/db.service");
const AppError = require("../errors/AppError");
const productService = require("../services/product.service");
const moment = require("moment");
const { ConfigStatusOrder } = require("../constants/user");

const get = async (req, res) => {
  const {
    page: _page,
    take: _take,
    sort_by,
    order_by,
    ...rest
  } = req.query || {};
  const page = +(_page ?? "1");
  const take = +(_take ?? "10");

  let filterQuery = "";

  Object.keys(rest)
    .filter((key) => !!rest[key])
    .forEach((key, index, keys) => {
      let suffix = index === Object.keys(keys).length - 1 ? "" : "AND";
      let subFilter = "";

      if (key === "keyword") {
        subFilter = `P.name LIKE '%${rest[key]}%' ${suffix} `;
      } else if (key === "minPrice") {
        subFilter = `price >= ${+rest[key]} ${suffix} `;
      } else if (key === "maxPrice") {
        subFilter = `price <= ${+rest[key]} ${suffix} `;
      } else {
        subFilter = `${key} = '${rest[key]}' ${suffix} `;
      }

      filterQuery = filterQuery + subFilter;
    });

  if (take < 10) throw new AppError("take min is 10", 400);

  const limit = `${(page - 1) * take},${take * page}`;
  const total = +(
    await db.query(`SELECT COUNT(*) as num FROM products ${
      filterQuery ? `WHERE ${filterQuery}` : ""
    }
  `)
  )[0].num;
  const totalPage = Math.ceil(total / take);
  const docs = await productService.get(filterQuery, {
    limit,
    sort_by,
    order_by,
  });

  res.status(200).json({
    docs,
    metadata: {
      page,
      take,
      total,
      totalPage,
      hasPreviousPage: page > 1,
      hasNextPage: totalPage > page,
    },
  });
};

const create = async (req, res) => {
  const image = req.file;
  const { name, price, category_id } = req.body;
  if (!name || !price || !category_id || !image)
    throw new AppError("name,price,category_id and image are required", 400);
  const imageDestination = image.destination.split("/");
  const fileName = `/${imageDestination[imageDestination.length - 1]}/${
    image.filename
  }`;

  await productService.create({
    ...req.body,
    image: fileName,
    created_at: moment().toDate(),
  });
  res.sendStatus(201);
};

const update = async (req, res) => {
  const image = req.file;
  const { id } = req.params;
  const findProduct = await productService.checkExistingProduct(id);

  if (!findProduct) throw new AppError("product not found", 404);
  let fileName = "";

  if (image) {
    const imageDestination = image.destination.split("/");
    fileName = `/${imageDestination[imageDestination.length - 1]}/${
      image.filename
    }`;
  }

  await productService.update(
    {
      ...req.body,
      image: fileName || findProduct.image,
      created_at: moment().toDate(),
    },
    id
  );
  res.sendStatus(200);
};

const hiddenProduct = async (req, res) => {
  const { id, hidden } = req.body;

  if (!id) throw new AppError("id must be required!", 400);

  await productService.update(
    {
      hidden: hidden || "0",
    },
    id
  );

  res.sendStatus(200);
};

const createReview = async (req, res) => {
  const { user_id } = req.user;
  const { product_id, comment, ...rest } = req.body;
  if (!product_id || !comment)
    throw new AppError(`id and comment are required`, 400);
  const file = req.file;

  let fileName = "";

  if (file) {
    const { filename, destination } = file;
    fileName = `/${destination.split("/").reverse()[0]}/${filename}`;
  }

  const orderUser = (
    await db.query(
      `
         SELECT * FROM orders as O 
         join order_items as O_I 
         on O.id = O_I.order_id
         WHERE O_I.product_id = ? AND O.user_id = ? AND status = ?
      `,
      [product_id, user_id, ConfigStatusOrder.SHIPPED]
    )
  )[0];

  if (!orderUser) throw new AppError("you dont have order with product", 400);

  await productService.insertReviewProduct({
    ...rest,
    comment,
    product_id,
    user_id,
    image: fileName,
    created_at: moment().toDate(),
  });
  res.sendStatus(200);
};

const updateReview = async (req, res) => {
  const { user_id } = req.user;
  const { review_id, ...rest } = req.body;
  if (!review_id) throw new AppError(`id  is required`, 400);
  const file = req.file;

  let fileName = "";

  if (file) {
    const { filename, destination } = file;
    fileName = `/${destination.split("/").reverse()[0]}/${filename}`;
  }

  const reviewItem = (
    await db.query(
      `SELECT * FROM review_product WHERE id = ? AND user_id = ?`,
      [review_id, user_id]
    )
  )[0];

  if (!reviewItem) throw new AppError("you no have permissions", 403);
  await productService.updateReviewProduct(
    { ...rest, image: fileName, updated_at: moment().toDate() },
    review_id
  );
  res.sendStatus(200);
};

const deleteProduct = async (req, res) => {
  const { user_id } = req.user;
  const { id } = req.body;
  if (!id) throw new AppError("id must be required", 400);
  const reviewItem = (
    await db.query(
      `SELECT * FROM review_product WHERE id = ? AND user_id = ?`,
      [id, user_id]
    )
  )[0];

  if (!reviewItem) throw new AppError("you no have permissions", 403);
  await productService.deleteReview(id);
  res.sendStatus(200);
};

const getReview = async (req, res) => {
  const { productId } = req.params;
  const { take: _take, page: _page } = req.query;
  const take = +(_take || "10");
  const page = +(_page || "1");
  const limit = `${(page - 1) * take},${take * page}`;
  const total = (
    await db.query(
      `SELECT COUNT(*) as total from review_product WHERE product_id = ?`,
      [productId]
    )
  )[0].total;
  if (!productId) throw new AppError("id must be required", 400);
  const docs = await productService.getReview(productId, limit);
  res.status(200).json({
    docs,
    metadata: {
      page,
      take,
      total,
      totalPage: Math.ceil(total / take),
      hasPreviousPage: page > 1,
      hasNextPage: page < Math.ceil(total / take),
    },
  });
};

module.exports = {
  get,
  create,
  update,
  hiddenProduct,
  createReview,
  updateReview,
  deleteProduct,
  getReview,
};

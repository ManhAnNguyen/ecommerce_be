const db = require("../services/db.service");
const AppError = require("../errors/AppError");
const productService = require("../services/product.service");
const moment = require("moment");

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

module.exports = { get, create, update, hiddenProduct };

const AppError = require("../errors/AppError");
const productService = require("../services/product.service");
const moment = require("moment");

const get = async (req, res) => {
  const result = await productService.get();

  res.status(200).json(result);
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

module.exports = { get, create, update };

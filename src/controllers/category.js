const AppError = require("../errors/AppError");
const categoryService = require("../services/category.service");
const moment = require("moment");

const get = async (req, res) => {
  const result = await categoryService.get();
  res.status(200).json(result);
};
const create = async (req, res) => {
  const { name } = req.body;
  await categoryService.create(name, moment().toDate());
  res.sendStatus(201);
};

const deleteCategory = async (req, res) => {
  const { id } = req.body;
  if (!id) throw new AppError("id is required", 400);
  await categoryService.deleteCategory(id);
  res.sendStatus(200);
};

module.exports = { get, create, deleteCategory };

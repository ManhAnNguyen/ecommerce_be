const AppError = require("../errors/AppError");
const bankService = require("../services/bank.service");

const getBanks = async (req, res) => {
  const result = await bankService.getBanks();

  res.status(200).json(result);
};

const createBank = async (req, res) => {
  const { name, code } = req.body;
  if (!name || !code) throw new AppError("name and code are required", 400);
  bankService.createBanks(name, code);
  res.sendStatus(201);
};

const deleteBank = async (req, res) => {
  const { id } = req.params;
  if (!id) throw new AppError("id is required", 400);
  bankService.deleteBank(id);
  res.sendStatus(200);
};

module.exports = { getBanks, createBank, deleteBank };

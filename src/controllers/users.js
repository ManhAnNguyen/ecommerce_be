const AppError = require("../errors/AppError");
const userService = require("../services/user.service");
const moment = require("moment");

const getAllUser = async (req, res) => {
  const result = await userService.getAllUser();

  res.status(200).json(result);
};

const getMe = async (req, res) => {
  const { user_id } = req.user;

  const result = await userService.getDetailUser(user_id);

  res.status(200).json(result);
};
const getDetailUser = async (req, res) => {
  const { id: user_id } = req.params;

  const result = await userService.getDetailUser(user_id);

  res.status(200).json(result);
};

const createAddress = async (req, res) => {
  const { district_id, province_id, commnue_id } = req.body;
  const { user_id } = req.user;
  if (!district_id || !province_id || !commnue_id)
    throw new AppError("district_id,province_id,commnue_id are required", 400);

  await userService.createAddressUser({ ...req.body, user_id });
  res.sendStatus(201);
};

const updateAddress = async (req, res) => {
  const { id } = req.params;

  const currentAddress = await userService.findUserAddress(id);
  if (!currentAddress) throw new AppError("address not found", 404);
  await userService.updateAddressUser(req.body, currentAddress);

  res.sendStatus(200);
};

const deleteAddress = async (req, res) => {
  const { id } = req.params;

  const currentAddress = await userService.findUserAddress(id);
  if (!currentAddress) throw new AppError("address not found", 404);

  await userService.deleteAddress(id);

  res.sendStatus(200);
};

const setDefaultAddress = async (req, res) => {
  const { id } = req.body;
  const currentAddress = await userService.findUserAddress(id);
  if (!currentAddress) throw new AppError("address not found", 404);

  await userService.setDefaultAddress(id);

  res.sendStatus(200);
};

const updateUser = async (req, res) => {
  const file = req.file;
  const avatar = file && `/${file.fieldname}/${file.filename}`;
  const { user_id } = req.user;

  userService.update(
    { ...req.body, avatar: avatar || null, created_at: moment().toDate() },
    { key: "id", value: user_id }
  );
  res.sendStatus(200);
};

const addBankUser = async (req, res) => {
  const { user_id } = req.user;

  const { bank_id } = req.body;
  if (!bank_id) throw new AppError("bank_id is required", 400);
  await userService.addBankUser(bank_id, user_id);
  res.sendStatus(200);
};

const removeBankUser = async (req, res) => {
  const { user_id } = req.user;

  const { bank_id } = req.body;
  if (!bank_id) throw new AppError("bank_id is required", 400);
  await userService.removeBank(bank_id, user_id);
  res.sendStatus(200);
};

const setDefaultBank = async (req, res) => {
  const { user_id } = req.user;
  const { bank_id, isDefault } = req.body;

  if (!bank_id || isDefault === undefined)
    throw new AppError("bank_id and isdefault are required", 400);

  await userService.setDefaultBank(bank_id, user_id, isDefault);
  res.sendStatus(200);
};

module.exports = {
  getMe,
  getDetailUser,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getAllUser,
  updateUser,
  addBankUser,
  removeBankUser,
  setDefaultBank,
};

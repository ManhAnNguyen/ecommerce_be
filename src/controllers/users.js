const AppError = require("../errors/AppError");
const userService = require("../services/user.service");

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

module.exports = {
  getMe,
  getDetailUser,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};

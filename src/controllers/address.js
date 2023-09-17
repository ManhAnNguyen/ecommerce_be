const AppError = require("../errors/AppError");
const addressService = require("../services/address.service");

//province
const createProvince = async (req, res) => {
  const { code, name } = req.body;

  if (!code || !name) throw new AppError("code and name are required", 400);

  await addressService.createProvince(name, code);
  res.sendStatus(200);
};

const getProvinces = async (req, res) => {
  const result = await addressService.getProvinces();

  res.status(200).json(result);
};

//district
const createDistrict = async (req, res) => {
  const { province_id, name, code } = req.body;

  if (!province_id || !name || !code)
    throw new AppError("province_id,name,code are required", 400);
  await addressService.createDistrict(name, code, province_id);
  res.sendStatus(200);
};

const getDistricts = async (req, res) => {
  const result = await addressService.getDistricts();

  res.status(200).json(result);
};

//commnue
const createCommune = async (req, res) => {
  const { district_id, name, code } = req.body;

  if (!district_id || !name || !code)
    throw new AppError("district_id,name,code are required", 400);
  await addressService.createCommune(name, code, district_id);
  res.sendStatus(200);
};

const getCommunee = async (req, res) => {
  const result = await addressService.getCommunes();

  res.status(200).json(result);
};

//get all address
const getAddress = async (req, res) => {
  const result = await addressService.getAddress();

  res.status(200).json(result);
};

module.exports = {
  createProvince,
  getProvinces,
  createDistrict,
  getDistricts,
  createCommune,
  getCommunee,
  getAddress,
};

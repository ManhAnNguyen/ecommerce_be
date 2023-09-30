import { Request, Response } from "express";
import AddressService from "../services/address";

const addressService = new AddressService();

const getProvinces = async (req: Request, res: Response) => {
  const data = await addressService.getProvince();
  res.status(200).json(data);
};

const createProvince = async (req: Request, res: Response) => {
  const { code, name } = req.body;
  await addressService.createProvince(code, name);
  res.sendStatus(201);
};

const getDistricts = async (req: Request, res: Response) => {
  const data = await addressService.getDistrict();
  res.status(200).json(data);
};

const createDistrict = async (req: Request, res: Response) => {
  const { province_code, name, code } = req.body;
  await addressService.createDistrict(name, code, province_code);
  res.sendStatus(201);
};

const createCommune = async (req: Request, res: Response) => {
  const { district_code, name, code } = req.body;
  await addressService.createCommune(name, code, district_code);
  res.sendStatus(201);
};

const getCommnue = async (req: Request, res: Response) => {
  const data = await addressService.getCommnue();
  res.status(200).json(data);
};

const getAddress = async (req: Request, res: Response) => {
  const data = await addressService.getAddress();
  res.status(200).json(data);
};

export {
  getProvinces,
  createProvince,
  getDistricts,
  createDistrict,
  createCommune,
  getCommnue,
  getAddress,
};

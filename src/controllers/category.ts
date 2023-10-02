import { Request, Response } from "express";
import CategoryService from "../services/category";

const categoryService = new CategoryService();

const get = async (req: Request, res: Response) => {
  const data = await categoryService.get();
  res.status(200).json(data);
};

const create = async (req: Request, res: Response) => {
  const { name } = req.body;
  await categoryService.create(name);
  res.sendStatus(201);
};

const remove = async (req: Request, res: Response) => {
  await categoryService.remove(req.params.id);
  res.sendStatus(200);
};

export { get, create, remove };

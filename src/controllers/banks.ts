import { Request, Response } from "express";
import BankService from "../services/banks";

const bankService = new BankService();

const getBanks = async (req: Request, res: Response) => {
  const banks = await bankService.getBanks();
  res.status(200).json(banks);
};

const createBank = async (req: Request, res: Response) => {
  const { code, name } = req.body;
  await bankService.createBank(name, code);
  res.sendStatus(201);
};

const deleteBank = async (req: Request, res: Response) => {
  await bankService.deleteBank(req.params.id);
  res.sendStatus(204);
};

//bank user

const addBankUser = async (
  req: Request & {
    user: Record<string, unknown>;
  },
  res: Response
) => {
  const { user_id } = req.user;

  const { bank_id } = req.body;

  await bankService.addBankUser(bank_id, user_id as string);
  res.sendStatus(201);
};

const removeBankUser = async (
  req: Request & {
    user: Record<string, unknown>;
  },
  res: Response
) => {
  const { user_id } = req.user;

  const { bank_id } = req.body;

  await bankService.removeBankUser(bank_id, user_id as string);
  res.sendStatus(200);
};

const setDefaultBank = async (
  req: Request & {
    user: Record<string, unknown>;
  },
  res: Response
) => {
  const { bank_id } = req.body;
  const { user_id } = req.user;

  await bankService.setDefaultBank(bank_id, user_id as string);
  res.sendStatus(200);
};

export {
  getBanks,
  createBank,
  deleteBank,
  addBankUser,
  removeBankUser,
  setDefaultBank,
};

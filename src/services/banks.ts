import { AppDataSource } from "../data-source";
import Banks from "../entity/Bank";
import UserBank from "../entity/UserBank";
import AppError from "../errors/AppError";
import {
  bankRepository,
  userBankRepository,
  userRepository,
} from "../repositories";

class BankService {
  //check existing bank

  private async checkExistingBank(id: string | number) {
    const bank = await bankRepository.findOneBy({ id });
    if (!bank) throw new AppError("bank not found", 404);
    return bank;
  }

  //check existing user bank
  private async checkExistingBankUser(
    id: string | number,
    user_id: string | number
  ) {
    const userBank = await userBankRepository.findOneBy({
      bank_id: id,
      user_id,
    });
    if (!userBank) throw new AppError("userBank not found", 404);
    return userBank;
  }

  async getBanks() {
    const banks = await bankRepository.find();
    return banks;
  }

  async createBank(name: string, code: string) {
    if (!name || !code) throw new AppError("code and name are rquired", 400);
    const bank = new Banks();
    bank.code = code;
    bank.name = name;
    await bankRepository.save(bank);
  }
  //delete bank
  async deleteBank(id: string | number) {
    const bank = await this.checkExistingBank(id);

    await bankRepository.delete({ id: bank.id });
  }

  //bank useer
  async addBankUser(bank_id: string | number, user_id: string | number) {
    const bank = await this.checkExistingBank(bank_id);
    const user = await userRepository.findOneBy({
      id: user_id,
    });

    const userBank = new UserBank();
    userBank.bank = bank;
    userBank.user = user;

    await userBankRepository.save(userBank);
  }

  async removeBankUser(bank_id: string | number, user_id: string | number) {
    const bank = await this.checkExistingBankUser(bank_id, user_id);
    await userBankRepository.delete(bank);
  }

  async setDefaultBank(bank_id: string | number, user_id: string | number) {
    const bank = await this.checkExistingBankUser(bank_id, user_id);

    const defaultBank = await userBankRepository.findOneBy({
      isDefault: true,
      user_id,
    });

    bank.isDefault = true;

    await AppDataSource.transaction(async (transactionalEntityManager) => {
      const userBankEntity = transactionalEntityManager.getRepository(UserBank);
      await userBankEntity.save(bank);
      if (defaultBank) {
        defaultBank.isDefault = false;
        await userBankEntity.save(defaultBank);
      }
    });
  }
}

export default BankService;

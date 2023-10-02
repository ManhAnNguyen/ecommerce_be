import Category from "../entity/Category";
import { categoryRepository } from "../repositories";

class CategoryService {
  async get() {
    const data = await categoryRepository.find();

    return data;
  }

  async create(name: string) {
    const category = new Category();
    category.name = name;
    await categoryRepository.save(category);
  }

  async remove(id: string) {
    const category = await categoryRepository.findOneBy({ id });
    await categoryRepository.delete({ id: category.id });
  }
}

export default CategoryService;

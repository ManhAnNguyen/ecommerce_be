import { Between, LessThanOrEqual, Like, MoreThanOrEqual } from "typeorm";
import { EDefaultPagination } from "../constants/enum";
import Products from "../entity/Product";
import AppError from "../errors/AppError";
import Pagination from "../instance/Pagination";
import { categoryRepository, productRepository } from "../repositories";

class ProductService {
  //check existing product
  private async checkExistingProduct(id: string | number) {
    const product = await productRepository.findOneBy({ id });
    if (!product) throw new AppError("product not found", 404);
    return product;
  }
  //get
  async get(
    meta: { take: number; page: number },
    order: { sort_by: string; order_by: string },
    query?: Record<string, unknown>
  ) {
    const { take, page } = meta;
    const { sort_by, order_by } = order;
    const { minPrice, maxPrice } = query || {};
    const filter = {} as Record<string, unknown>;

    //filter
    Object.entries(query)
      .filter(([key]) => key !== "minPrice" && key !== "maxPrice")
      .forEach(([key, value]) => {
        if (!!value) {
          if (key === "keyword") {
            filter["name"] = Like(`%${value}%`);
          }
        }
      });

    if (minPrice && maxPrice) {
      filter.price = Between(+minPrice, +maxPrice);
    } else if (minPrice) {
      filter.price = MoreThanOrEqual(+minPrice);
    } else if (maxPrice) {
      filter.price = LessThanOrEqual(+maxPrice);
    }

    const [docs, total] = await productRepository.findAndCount({
      take: take,
      skip: (page - 1) * take,
      order: {
        [sort_by]: order_by,
      },
      where: { ...filter, hidden: false },
      relations: {
        category: true,
      },
      select: {
        id: true,
        name: true,
        price: true,
        created_at: true,
        updated_at: true,
        image: true,
        quantity: true,
        description: true,
        category: {
          id: true,
          name: true,
        },
      },
    });
    const pagination = new Pagination(total, page, take);

    return {
      docs,
      metadata: pagination,
    };
  }
  //create
  async create(
    name: string,
    price: number,
    category_id: string,
    image: Express.Multer.File
  ) {
    if (!name || !price || !category_id || !image)
      throw new AppError("name,price,category_id and image are required", 400);
    const imageDestination = image.destination.split("/");
    const fileName = `/${imageDestination[imageDestination.length - 1]}/${
      image.filename
    }`;

    const category = await categoryRepository.findOneBy({ id: category_id });
    if (!category) throw new AppError("category not found", 404);
    const product = new Products();
    product.name = name;
    product.price = price;
    product.image = fileName;
    product.category = category;
    await productRepository.save(product);
  }

  //update
  async update(id: string | number, data: Record<string, unknown>) {
    const product = await this.checkExistingProduct(id);

    for (let key in data) {
      if (!!data[key]) {
        product[key] = data[key];
      }
    }

    await productRepository.save(product);
  }

  //hidden
  async hiddenProduct(id: string | number, hidden: boolean) {
    const product = await this.checkExistingProduct(id);
    product.hidden = hidden;
    await productRepository.save(product);
  }
}

export default ProductService;

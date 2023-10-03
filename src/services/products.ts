import { Between, LessThanOrEqual, Like, MoreThanOrEqual } from "typeorm";
import { EConfigStatusOrder, EDefaultPagination } from "../constants/enum";
import Products from "../entity/Product";
import AppError from "../errors/AppError";
import Pagination from "../instance/Pagination";
import {
  categoryRepository,
  orderItemsRepository,
  productRepository,
  reviewProductRepository,
  userRepository,
} from "../repositories";
import ReviewProduct from "../entity/ReviewProduct";

class ProductService {
  //check existing product
  private async checkExistingProduct(id: string | number) {
    const product = await productRepository.findOneBy({ id });
    if (!product) throw new AppError("product not found", 404);
    return product;
  }

  //check comment
  private async checkOwnerComment(
    reviewId: string | number,
    user_id: string | number
  ) {
    const review = await reviewProductRepository.findOneBy({ id: reviewId });
    if (!review) throw new AppError("review not found", 404);

    const isUserReviewed = await reviewProductRepository.exist({
      where: {
        id: review.id,
        user: {
          id: user_id,
        },
      },
    });

    if (!isUserReviewed) throw new AppError("not permission", 403);

    return review;
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

  //get review
  async getReview(id: string | number) {
    const product = await this.checkExistingProduct(id);
    const [docs, total] = await reviewProductRepository.findAndCount({
      where: {
        product: {
          id: product.id,
        },
      },
      select: {
        user: {
          id: true,
          username: true,
          avatar: true,
        },
      },
      relations: {
        user: true,
      },
    });

    return {
      docs,
      total,
    };
  }

  //create review
  async createReview(
    productId: string | number,
    user_id: string | number,
    data: Record<string, unknown>
  ) {
    const product = await this.checkExistingProduct(productId);
    const user = await userRepository.findOneBy({ id: user_id });

    if (!data["comment"]) throw new AppError("comment is required", 400);
    const isBought = await orderItemsRepository.exist({
      where: {
        product: {
          id: product.id,
        },
        order: {
          status: EConfigStatusOrder.SHIPPED,
          user: {
            id: user.id,
          },
        },
      },
    });

    if (!isBought) throw new AppError("not havenot bought product", 403);

    const reviewProduct = new ReviewProduct();
    reviewProduct.product = product;
    reviewProduct.user = user;

    for (let key in data) {
      if (!!data[key]) {
        reviewProduct[key] = data[key];
      }
    }

    await reviewProductRepository.save(reviewProduct);
  }

  //update review
  async updateReview(
    reviewId: string | number,
    user_id: string | number,
    data: Record<string, unknown>
  ) {
    const review = await this.checkOwnerComment(reviewId, user_id);

    for (let key in data) {
      if (!!data[key]) {
        review[key] = data[key];
      }
    }

    await reviewProductRepository.save(review);
  }

  //delete review
  async deleteReview(reviewId: string | number, user_id: string | number) {
    const review = await this.checkOwnerComment(reviewId, user_id);
    await reviewProductRepository.delete({
      id: review.id,
    });
  }
}

export default ProductService;

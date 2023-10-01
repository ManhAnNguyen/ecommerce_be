import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import Products from "./Product";

@Entity("category")
class Category {
  @PrimaryGeneratedColumn("increment")
  id: string | number;
  @Column()
  name: string;
  @CreateDateColumn()
  created_at: string;
  @OneToMany(() => Products, (product) => product.category)
  products: Products[];
}

export default Category;

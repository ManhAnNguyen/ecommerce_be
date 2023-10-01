import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  UpdateQueryBuilder,
} from "typeorm";
import Category from "./Category";

@Entity("products")
class Products {
  @PrimaryGeneratedColumn("increment")
  id: string | number;
  @Column()
  name: string;
  @Column()
  price: number;
  @CreateDateColumn()
  created_at: string;
  @UpdateDateColumn()
  updated_at: string;
  @Column()
  image: string;
  @Column()
  quantity: number;
  @Column({
    default: false,
    nullable: true,
  })
  hidden: boolean;
  @Column({
    nullable: true,
  })
  description: string;
  @ManyToOne(() => Category, (category) => category.id, {
    nullable: false,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "categoryId", referencedColumnName: "id" })
  category: Category;
}

export default Products;

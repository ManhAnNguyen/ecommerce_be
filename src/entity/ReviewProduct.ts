import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import Products from "./Product";

@Entity("reviewProduct")
class ReviewProduct {
  @PrimaryGeneratedColumn("increment")
  id: string | number;
  @Column({
    nullable: true,
  })
  image: string;
  @Column({
    nullable: true,
  })
  comment: string;
  @Column({
    nullable: true,
  })
  star: number;
  @CreateDateColumn()
  created_at: string;
  @UpdateDateColumn()
  updated_at: string;

  //user
  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({
    name: "userId",
    referencedColumnName: "id",
  })
  user: User;

  //product
  @ManyToOne(() => Products, (product) => product.id, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    nullable: false,
  })
  @JoinColumn({
    name: "produtId",
    referencedColumnName: "id",
  })
  product: Products;
}

export default ReviewProduct;

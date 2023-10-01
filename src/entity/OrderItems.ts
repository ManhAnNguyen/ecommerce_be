import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import Orders from "./Orders";
import Products from "./Product";

@Entity("orderItems")
class OrderItems {
  @PrimaryColumn()
  productId: string | number;
  @PrimaryColumn()
  orderId: string | number;
  @Column()
  quantity: number;
  //ref : order
  @ManyToOne(() => Orders, (order) => order.id, {
    nullable: false,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({
    name: "orderId",
    referencedColumnName: "id",
  })
  order: Orders;

  //ref : products
  @ManyToOne(() => Products, (product) => product.id, {
    nullable: false,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({
    name: "productId",
    referencedColumnName: "id",
  })
  product: Products;
}

export default OrderItems;

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { EConfigStatusOrder } from "../constants/enum";
import { User } from "./User";
import PaymentMethod from "./PaymentMethod";
import UserAddress from "./UserAddress";
import OrderItems from "./OrderItems";

@Entity("orders")
class Orders {
  @PrimaryGeneratedColumn("increment")
  id: string | number;
  @CreateDateColumn()
  created_at: string;
  @UpdateDateColumn()
  updated_at: string;
  @Column({
    default: EConfigStatusOrder.PENDING,
  })
  status: EConfigStatusOrder;

  //ref : user
  @ManyToOne(() => User, {
    nullable: false,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({
    name: "userId",
    referencedColumnName: "id",
  })
  user: User;

  //ref :payment method
  @ManyToOne(() => PaymentMethod, {
    nullable: false,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({
    name: "paymentMethod",
    referencedColumnName: "id",
  })
  paymentMethod: PaymentMethod;

  //ref : address
  @ManyToOne(() => UserAddress, {
    nullable: false,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({
    name: "address",
    referencedColumnName: "id",
  })
  address: UserAddress;

  //ref : Product
  @OneToMany(() => OrderItems, (orderItem) => orderItem.order)
  products: OrderItems;
}

export default Orders;

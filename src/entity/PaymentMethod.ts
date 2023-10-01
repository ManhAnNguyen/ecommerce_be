import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("paymentMethod")
class PaymentMethod {
  @PrimaryGeneratedColumn("increment")
  id: string | number;
  @Column()
  name: string;
}

export default PaymentMethod;

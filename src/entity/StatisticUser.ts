import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { User } from "./User";

@Entity("statisticUser")
class StatisticUser {
  @PrimaryColumn()
  user_id: string | number;
  @Column()
  total_item_order: number;
  @Column()
  total_price: number;

  @OneToOne(() => User, {
    nullable: false,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
  })
  user: User;
}

export default StatisticUser;

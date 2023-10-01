import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./User";
import Banks from "./Bank";

@Entity("userBank")
class UserBank {
  @PrimaryColumn()
  user_id: string | number;
  @PrimaryColumn()
  bank_id: string | number;
  @Column({
    nullable: true,
    default: false,
  })
  isDefault: boolean;

  //user
  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
  })
  user: User;

  //bank
  @ManyToOne(() => Banks, (bank) => bank.id, {
    nullable: false,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({
    name: "bank_id",
    referencedColumnName: "id",
  })
  bank: Banks;
}

export default UserBank;

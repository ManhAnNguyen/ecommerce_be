import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import Commune from "./Commune";
import District from "./District";
import Province from "./Province";

@Entity("userAddress")
class UserAddress {
  @PrimaryGeneratedColumn("increment")
  id: string | number;
  @Column()
  specific: string;
  @Column()
  isDefault: boolean;
  //user
  @ManyToOne(() => User, (user) => user.id, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
  })
  user: User;

  //commune
  @ManyToOne(() => Commune, (commune) => commune.code, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  commune: Commune;

  //district
  @ManyToOne(() => District, (district) => district.code, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  district: District;

  //province
  @ManyToOne(() => Province, (province) => province.code, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  province: Province;
}

export default UserAddress;

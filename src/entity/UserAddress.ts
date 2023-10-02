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
import Commune from "./Commune";
import District from "./District";
import Province from "./Province";

@Entity("userAddress")
class UserAddress {
  @PrimaryGeneratedColumn("increment")
  id: string | number;
  @Column({
    nullable: true,
  })
  specific: string;
  @Column({
    default: false,
    nullable: true,
  })
  isDefault: boolean;
  @CreateDateColumn()
  created_at: string;
  @UpdateDateColumn()
  updated_at: string;

  //user
  @ManyToOne(() => User, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
  })
  user: User;

  //commune
  @ManyToOne(() => Commune, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({
    name: "communeCode",
    referencedColumnName: "code",
  })
  commune: Commune;

  //district
  @ManyToOne(() => District, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({
    name: "districtCode",
    referencedColumnName: "code",
  })
  district: District;

  //province
  @ManyToOne(() => Province, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({
    name: "provinceCode",
    referencedColumnName: "code",
  })
  province: Province;
}

export default UserAddress;

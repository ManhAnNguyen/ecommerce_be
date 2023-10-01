import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import UserAddress from "./UserAddress";
import StatisticUser from "./StatisticUser";
import UserBank from "./UserBank";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("increment")
  id: number | string;
  @Column({ length: 255 })
  username: string;
  @Column({ nullable: true })
  email: string;
  @Column({ length: 255 })
  password: string;
  @Column({ nullable: true })
  phone: string;
  @Column({ nullable: true })
  gender: string;
  @Column({ nullable: true })
  birthday: string;
  @CreateDateColumn()
  created_at: string;
  @UpdateDateColumn()
  updated_at: string;
  @Column({ nullable: true })
  locked: boolean;
  @Column({ nullable: true })
  refreshToken: string;

  @Column({ nullable: true })
  avatar: string;

  //address
  @OneToMany(() => UserAddress, (userAddress) => userAddress.user)
  userAddress: UserAddress[];

  //statistic

  @OneToOne(() => StatisticUser, (statistic) => statistic.user)
  statisticUser: StatisticUser;

  //bank
  @OneToMany(() => UserBank, (userBank) => userBank.user)
  userBanks: UserBank[];
}

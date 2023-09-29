import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

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
}

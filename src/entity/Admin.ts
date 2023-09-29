import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("admin")
export class Admin {
  @PrimaryGeneratedColumn("uuid")
  admin_id: string;
  @Column({ length: 255 })
  username: string;
  @Column({ length: 255 })
  password: string;
  @CreateDateColumn()
  created_at: string;
}

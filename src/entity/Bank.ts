import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("banks")
class Banks {
  @PrimaryGeneratedColumn("increment")
  id: string | number;
  @Column()
  name: string;
  @Column()
  code: string;
}

export default Banks;

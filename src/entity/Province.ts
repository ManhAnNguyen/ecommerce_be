import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import District from "./District";

@Entity("provinces")
class Province {
  @PrimaryColumn()
  code: string;
  @Column()
  name: string;
  @OneToMany(() => District, (district) => district.province)
  districts: District[];
}

export default Province;

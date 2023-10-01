import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import District from "./District";

@Entity("communes")
class Commune {
  @Column()
  name: string;
  @PrimaryColumn()
  code: string;
  @ManyToOne(() => District, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    nullable: false,
  })
  @JoinColumn({
    name: "district_code",
    referencedColumnName: "code",
  })
  district: District;
}

export default Commune;

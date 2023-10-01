import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import Province from "./Province";
import Commune from "./Commune";

@Entity("districts")
class District {
  @PrimaryColumn()
  code: string;
  @Column()
  name: string;

  //join province;
  @ManyToOne(() => Province, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    nullable: false,
  })
  @JoinColumn({
    name: "province_code",
    referencedColumnName: "code",
  })
  province: Province;

  //join commune;
  @OneToMany(() => Commune, (commune) => commune.district)
  communes: Commune[];
}

export default District;

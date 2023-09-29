import { Entity, PrimaryColumn } from "typeorm";

@Entity("communes")
class Commune {
  @PrimaryColumn()
  name: string;
  @PrimaryColumn()
  code: string;
}

export default Commune;

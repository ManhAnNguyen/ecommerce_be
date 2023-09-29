import { Entity, PrimaryColumn } from "typeorm";

@Entity("provinces")
class Province {
  @PrimaryColumn()
  name: string;
  @PrimaryColumn()
  code: string;
}

export default Province;

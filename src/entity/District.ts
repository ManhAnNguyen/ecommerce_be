import { Entity, PrimaryColumn } from "typeorm";

@Entity("districts")
class District {
  @PrimaryColumn()
  name: string;
  @PrimaryColumn()
  code: string;
}

export default District;

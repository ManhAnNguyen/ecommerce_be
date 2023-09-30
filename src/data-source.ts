require("dotenv").config();
import "reflect-metadata";
import { DataSource } from "typeorm";
import { username, password, db_name, port, host } from "./config/env";

export const AppDataSource = new DataSource({
  type: "mysql",
  host,
  port: +port,
  username,
  password,
  database: db_name,
  synchronize: false,
  logging: true,
  entities: ["src/entity/*.ts"],
  migrations: ["src/migration/*.ts"],
  subscribers: [],
});

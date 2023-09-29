require("dotenv").config();
import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { username, password, db_name, port, host } from "./config/env";

export const AppDataSource = new DataSource({
  type: "mysql",
  host,
  port: +port,
  username,
  password,
  database: db_name,
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
});
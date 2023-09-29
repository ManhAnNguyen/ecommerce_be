const username = process.env.DB_USER_NAME;
const password = process.env.DB_PASSWORD;
const db_name = process.env.DB_NAME;
const port = process.env.DB_PORT;
const host = process.env.DB_HOST;
const PORT = process.env.PORT;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const HASH_PWD = +process.env.HASH_PWD;

export {
  username,
  password,
  db_name,
  port,
  host,
  PORT,
  HASH_PWD,
  ACCESS_TOKEN,
  REFRESH_TOKEN,
};

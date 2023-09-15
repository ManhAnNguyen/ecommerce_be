const mysql = require("mysql2/promise");
const config = require("../config/db");

async function query(sql, params) {
  const connection = await mysql.createConnection(config);
  const [rows, fields] = await connection.execute(sql, params);

  return rows;
}

module.exports = { query };

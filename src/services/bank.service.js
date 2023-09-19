const db = require("./db.service");

const getBanks = () => db.query(`SELECT * from banks`);

const createBanks = (name, code) =>
  db.query(`INSERT INTO banks (name,code) VALUES (?,?)`, [name, code]);
const deleteBank = (id) => db.query(`DELETE FROM banks where id = ?`, [id]);
module.exports = { getBanks, createBanks, deleteBank };

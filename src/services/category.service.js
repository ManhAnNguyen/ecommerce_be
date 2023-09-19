const db = require("./db.service");

const create = (name, created_at) =>
  db.query(`INSERT INTO category (name,created_at) VALUES (?,?)`, [
    name,
    created_at,
  ]);

const get = () => db.query(`SELECT * FROM category`);
const deleteCategory = (id) =>
  db.query(`DELETE  FROM category WHERE id = ?`, [id]);

module.exports = { create, get, deleteCategory };

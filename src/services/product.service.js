const db = require("./db.service");

const get = () => db.query(`SELECT * FROM products`);
const create = async (data) => {
  const keys = Object.keys(data);
  const values = Object.values(data);

  let questionMark = "";
  keys.forEach(
    (_, index) =>
      (questionMark = questionMark + `?${index === keys.length - 1 ? "" : ","}`)
  );

  await db.query(
    `INSERT INTO products (${keys.toString()}) VALUES (${questionMark})`,
    values
  );
};

const update = async (data, product_id) => {
  const keys = Object.keys(data);
  const values = Object.values(data);
  let questionMark = "";
  keys.forEach(
    (key, index) =>
      (questionMark =
        questionMark + `${key} =?${index === keys.length - 1 ? "" : ","}`)
  );

  await db.query(`UPDATE products SET ${questionMark} WHERE id = ?`, [
    ...values,
    product_id,
  ]);
};

const checkExistingProduct = async (id) => {
  const result = await db.query(`SELECT * FROM products WHERE id = ?`, [id]);
  return result[0];
};

module.exports = { get, create, checkExistingProduct, update };

const db = require("./db.service");

const get = async (
  filterQuery,
  { limit, sort_by = "id", order_by = "ASC" }
) => {
  const result = await db.query(
    `SELECT P.id,P.name,P.price,P.created_at,P.updated_at,P.image,P.quantity,P.hidden,P.description,
    (json_object(
      'id',C.id,
      'name',C.name
    )) as category FROM products as P join category as C on P.category_id = C.id
     ${filterQuery ? `WHERE ${filterQuery}` : ""}
    ORDER BY ${sort_by} ${order_by}
    LIMIT  ${limit}
    `
  );

  return result;
};

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

const insertReviewProduct = async (data) => {
  const filterData = Object.keys(data)
    .filter((key) => !!data[key])
    .reduce((result, key) => ({ ...result, [key]: data[key] }), {});
  const keys = Object.keys(filterData);
  const values = Object.values(filterData);
  const questionMark = keys.reduce(
    (result, key, index, arrayKeys) =>
      result + `? ${index !== arrayKeys.length - 1 ? "," : ""}`,
    ""
  );

  await db.query(
    `INSERT INTO review_product (${keys.toString()}) VALUES(${questionMark})`,
    [...values]
  );
};

const updateReviewProduct = async (data, review_id) => {
  const filterData = Object.keys(data)
    .filter((key) => !!data[key])
    .reduce((result, key) => ({ ...result, [key]: data[key] }), {});
  const keys = Object.keys(filterData);
  const values = Object.values(filterData);
  const questionMark = keys.reduce(
    (result, key, index, arrayKeys) =>
      result + `${key} =? ${index !== arrayKeys.length - 1 ? "," : ""}`,
    ""
  );

  await db.query(`UPDATE review_product SET ${questionMark} WHERE id = ?`, [
    ...values,
    review_id,
  ]);
};

const deleteReview = (id) =>
  db.query(`DELETE FROM review_product WHERE id = ?`, [id]);

const getReview = (product_id, limit) =>
  db.query(
    `
    SELECT R.id,R.image,R.comment,R.star,R.created_at,R.updated_at,
    json_object(
       'username',U.username,
       'avatar',U.avatar
    ) as creator  
    FROM review_product as R 
    join users as U on U.id = R.user_id
    WHERE R.product_id = ?
    LIMIT ${limit}
    `,
    [product_id]
  );

module.exports = {
  get,
  create,
  checkExistingProduct,
  update,
  insertReviewProduct,
  updateReviewProduct,
  deleteReview,
  getReview,
};

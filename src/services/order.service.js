const db = require("./db.service");

const create = async (data) => {
  const keys = Object.keys(data);
  const values = Object.values(data);

  let questionMark = "";
  keys.forEach(
    (_, index) =>
      (questionMark = questionMark + `?${index === keys.length - 1 ? "" : ","}`)
  );

  return db.query(
    `INSERT INTO orders (${keys.toString()}) VALUES (${questionMark})`,
    values
  );
};

const insertProduct = (product_id, qty, order_id) =>
  db.query(`INSERT INTO order_items (product_id,qty,order_id) VALUES(?,?,?)`, [
    product_id,
    qty,
    order_id,
  ]);

const get = (user_id, { limit, order_by, sort_by, filter }) =>
  db.query(
    `
      SELECT O.id,O.created_at,O.status,O.admin_id,P_M.name as paymentMethod,
      (
      SELECT SUM(P_1.price * O_I_1.qty)
      from order_items as O_I_1 join products as P_1 on P_1.id = O_I_1.product_id
      WHERE O_I_1.order_id = O.id
      group by O_I_1.order_id

      ) as total,
      (json_object(
        'specific',U_A.specific_address,
        'commune',commune.name,
        'district',district.name,
        'province',province.name
      )) as address,
       (
          SELECT json_arrayagg (
            json_object(
                'id',P.id,
                'name',P.name,
                'image',P.image,
                'price',P.price,
                'qty',O_I.qty,
                'category',C.name
            )
          ) from order_items as O_I
          join products as P
          on P.id = O_I.product_id
          join category as C
          on C.id  = P.category_id
          WHERE O_I.order_id = O.id
      ) as products
      FROM orders as O
      join payment_method as P_M
      on P_M.id = O.payment_method_id
      join user_address as U_A
      on U_A.id = O.address_id
      join commune on commune.id = U_A.commnue_id
      join district on district.id = U_A.district_id
      join province on province.id =  U_A.province_id
      WHERE O.user_id = ?  ${filter}
      ORDER BY ${sort_by || "id"} ${order_by || "ASC"}
      LIMIT ${limit}
    `,
    [user_id]
  );

const changeStatus = (id, status_order) =>
  db.query(`UPDATE orders SET status = ? WHERE id = ?`, [status_order, id]);

const findOrder = async (id) => {
  const res = await db.query(`SELECT * FROM orders WHERE id =?`, [id]);
  return res[0];
};

const getStatisticOrder = (id) =>
  db.query(
    `
    SELECT  (
      SELECT SUM(P_1.price * O_I_1.qty)
      from order_items as O_I_1 join products as P_1 on P_1.id = O_I_1.product_id
      WHERE O_I_1.order_id = O.id
      group by O_I_1.order_id

      ) as total,
      
      (
      SELECT SUM(O_I_1.qty)
      from order_items as O_I_1 
      WHERE O_I_1.order_id = O.id
      group by O_I_1.order_id

      ) as qty
      from orders as O
      WHERE O.id = ?
    `,
    [id]
  );

module.exports = {
  create,
  insertProduct,
  get,
  changeStatus,
  findOrder,
  getStatisticOrder,
};

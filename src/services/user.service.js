const db = require("./db.service");

const checkExistingUser = async (info) => {
  const result = await db.query(
    `SELECT * FROM users WHERE id = ? OR username = ?`,
    [info, info]
  );

  return result[0];
};

const create = async (username, password, created_at) =>
  db.query(`INSERT INTO users (username,password,created_at) VALUES(?,?,?)`, [
    username,
    password,
    created_at,
  ]);

const update = async (data, condition) => {
  let updateColumn = "";

  const keys = Object.keys(data);
  const values = Object.values(data);
  keys.forEach((item, index) => {
    updateColumn = `${updateColumn}${index === 0 ? "" : ","} ${item} = ?`;
  });

  db.query(`UPDATE users SET ${updateColumn} WHERE ${condition.key} = ?`, [
    ...values,
    condition.value,
  ]);
};

const getDetailUser = async (id) => {
  const result = await db.query(
    `
select U.id as id,
U.username,
U.email,
U.phone,
U.gender,
U.birthday,
U.created_at,
U.updated_at,
U.rank_user,
U.avatar,
U.locked,
S_T.total_item_order,
S_T.total_price_order,
(
	select json_arrayagg(
		json_object (
			'id',U_D.id,
            'specific',U_D.specific_address,
            'isDefault',U_D.isDefault,
            'commune' , C.name,
            'district',D.name,
            'province',P.name
        )
    ) from 
    user_address as U_D
    join commune as C on C.id = U_D.commnue_id
    join district as D on D.id  = U_D.district_id
    join province as P on P.id = U_D.province_id
	WHERE U_D.user_id = U.id 

) as address
from users as U  
left join statistic_user as S_T 
on U.id = S_T.user_id
WHERE U.id = ?;
`,
    [id]
  );

  return result[0];
};

//address
const createAddressUser = async (newAddress) => {
  const keys = Object.keys(newAddress);
  let columns = "";
  let values = "";

  keys.forEach((item, index) => {
    columns = columns + `${item}${index !== keys.length - 1 ? "," : ""}`;
    values = values + `?${index !== keys.length - 1 ? "," : ""}`;
  });

  await db.query(
    `INSERT INTO user_address (${columns}) VALUES (${values}) `,
    Object.values(newAddress)
  );
};

const updateAddressUser = async (newAddress, currentAddress) => {
  const keys = Object.keys(newAddress);
  const newValues = Object.values(newAddress);
  let query = "";
  keys.forEach(
    (item, index) =>
      (query = query + `${item} = ? ${index !== keys.length - 1 ? "," : ""}`)
  );

  await db.query(`UPDATE user_address SET ${query} WHERE id = ?`, [
    ...newValues,
    currentAddress.id,
  ]);
};

const findUserAddress = async (id) => {
  const result = await db.query(`SELECT * FROM user_address WHERE id = ?`, [
    id,
  ]);

  return result[0];
};

const deleteAddress = (id) =>
  db.query(`DELETE FROM user_address WHERE id = ?`, [id]);

const setDefaultAddress = async (id) => {
  await db.query(`UPDATE user_address SET isDefault = null WHERE id <> ? `, [
    id,
  ]);
  await db.query(`UPDATE user_address SET isDefault = true WHERE id = ? `, [
    id,
  ]);
};

//

module.exports = {
  checkExistingUser,
  create,
  update,
  getDetailUser,
  createAddressUser,
  updateAddressUser,
  findUserAddress,
  deleteAddress,
  setDefaultAddress,
};

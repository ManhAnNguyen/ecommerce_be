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

module.exports = { checkExistingUser, create, update };

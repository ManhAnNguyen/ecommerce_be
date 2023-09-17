const db = require("./db.service.js");

const checkExistingAdmin = async (info) => {
  const result = await db.query(
    `SELECT * FROM admin WHERE admin_id = ? OR username = ?`,
    [info, info]
  );

  return result[0];
};

module.exports = { checkExistingAdmin };

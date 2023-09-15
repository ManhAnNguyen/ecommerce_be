const db = require("./db.service.js");

const checkExistingAdmin = async (admin_id) => {
  const result = await db.query(`SELECT * FROM admin WHERE admin_id = ?`, [
    admin_id,
  ]);

  return result[0];
};

module.exports = { checkExistingAdmin };

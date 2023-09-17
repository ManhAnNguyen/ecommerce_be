const AppError = require("../errors/AppError");
const adminService = require("../services/admin.service");

module.exports = async (req, rest, next) => {
  const admin = req.admin;
  if (!admin) throw new AppError("no permission", 403);

  const { admin_id } = req.admin;

  const infoAdmin = await adminService.checkExistingAdmin(admin_id);

  if (!infoAdmin) throw new AppError("no permission", 403);
  next();
};

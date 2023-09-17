const AppError = require("../errors/AppError");
const adminService = require("../services/admin.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new AppError("username and password are required", 400);
  }

  const existingAdmin = await adminService.checkExistingAdmin(username);
  if (!existingAdmin)
    throw new AppError("username or password is not correct", 404);
  const comparePwd = bcrypt.compareSync(password, existingAdmin.password);

  if (!comparePwd)
    throw new AppError("username or password is not correct", 404);

  const infoAdmin = {
    admin_id: existingAdmin.admin_id,
    username: existingAdmin.username,
  };
  //create token and send to client
  const accessToken = jwt.sign(infoAdmin, process.env.ACCESS_TOKEN, {
    expiresIn: "1d",
  });

  res.status(200).json(accessToken);
};

module.exports = { login };

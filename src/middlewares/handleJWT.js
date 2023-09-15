const AppError = require("../errors/AppError");
const userService = require("../services/user.service.js");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const token = req?.headers?.authorization?.split(" ")?.[1];

  if (!token) throw new AppError("Unauthorized", 401);

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
  if (!decoded) throw new AppError("Unauthorized", 401);

  const findUser = await userService.checkExistingUser(decoded.user_id);
  if (!findUser) throw new AppError("Unauthorized", 401);
  const { iat, exp, ...rest } = decoded;
  req.user = {
    ...rest,
  };

  next();
};

const moment = require("moment");
const AppError = require("../errors/AppError");
const userService = require("../services/user.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new AppError("username and password are required", 400);
  }

  const existingUser = await userService.checkExistingUser(username);

  if (existingUser) throw new AppError("username is not available", 409);
  const hashedPwd = bcrypt.hashSync(password, +process.env.HASH_PWD);

  await userService.create(username, hashedPwd, new Date());

  res.sendStatus(200);
};

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new AppError("username and password are required", 400);
  }

  const existingUser = await userService.checkExistingUser(username);
  if (!existingUser)
    throw new AppError("username or password is not correct", 404);
  if (Boolean(existingUser.locked)) {
    throw new AppError("your account is locked", 403);
  }
  const comparePwd = bcrypt.compareSync(password, existingUser.password);

  const infoUser = {
    user_id: existingUser.id,
    username: existingUser.username,
  };

  if (!comparePwd)
    throw new AppError("username or password is not correct", 404);

  //create token and send to client
  const accessToken = jwt.sign(infoUser, process.env.ACCESS_TOKEN, {
    expiresIn: "1d",
  });

  //create refresh token and save in db and send to client via cookie
  const refreshToken = jwt.sign(infoUser, process.env.REFRESH_TOKEN, {
    expiresIn: "2d",
  });

  await userService.update(
    { refreshToken },
    {
      key: "id",
      value: infoUser.user_id,
    }
  );

  res.cookie("refreshToken", refreshToken, {
    // secure: true,
    httpOnly: true,
    expires: moment().add("1", "day").toDate(),
  });
  res.status(200).json(accessToken);
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const { user_id } = req.user;
  if (!currentPassword || !newPassword)
    throw new AppError("currentPassword and newPassword are required", 400);
  const { password } = (await userService.checkExistingUser(user_id)) || {};

  const comparePwd = bcrypt.compareSync(currentPassword, password);
  if (!comparePwd) throw new AppError("Current password is not correct", 400);

  const hashedPwd = bcrypt.hashSync(newPassword, +process.env.HASH_PWD);
  await userService.update(
    {
      password: hashedPwd,
    },
    {
      key: "id",
      value: user_id,
    }
  );
  res.sendStatus(200);
};

const refreshToken = async (req, res) => {
  const { refreshToken } = req.cookies || {};
  if (!refreshToken) throw new AppError("must be provide refreshToken", 400);

  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
  if (!decoded) throw new AppError("incorrect refreshToken", 400);

  const existingUser = await userService.checkExistingUser(decoded.user_id);
  if (!existingUser) throw new AppError("incorrect refreshToken");

  const infoUser = {
    user_id: existingUser.id,
    username: existingUser.username,
  };
  const accessToken = jwt.sign(infoUser, process.env.ACCESS_TOKEN, {
    expiresIn: "1d",
  });

  res.status(200).json(accessToken);
};

const logout = async (req, res) => {
  //FE also delete token in localstorage
  const { refreshToken } = req.cookies || {};
  if (!refreshToken) return res.sendStatus(200);

  //clear refresh token in db
  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
  if (!decoded) return res.sendStatus(200);

  const existingUser = await userService.checkExistingUser(decoded.user_id);
  if (!existingUser) return res.sendStatus(200);

  await userService.update(
    { refreshToken: null },
    { key: "id", value: decoded.user_id }
  );
  res.clearCookie("refreshToken");
  res.sendStatus(200);
};

module.exports = { register, login, changePassword, refreshToken, logout };

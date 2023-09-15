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
  const comparePwd = bcrypt.compareSync(password, existingUser.password);
  const infoUser = {
    user_id: existingUser.id,
    username: existingUser.id,
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
    secure: true,
    httpOnly: true,
    expires: moment().add("1", "day").toDate(),
  });
  res.status(200).json(accessToken);
};

module.exports = { register, login };

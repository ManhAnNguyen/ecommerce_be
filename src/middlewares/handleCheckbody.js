const AppError = require("../errors/AppError");

const handleCheckbody = (notAllowedList) => (req, res, next) => {
  Object.keys(req.body).forEach((key) => {
    if (notAllowedList.includes(key)) {
      throw new AppError(`${key} is immutable`, 400);
    }
  });

  next();
};

module.exports = handleCheckbody;

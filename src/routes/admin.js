const router = require("express").Router();
const adminController = require("../controllers/admin");

router.post("/login", adminController.login);

router.post("/user/locked", adminController.lockedUser);

module.exports = router;

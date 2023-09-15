const router = require("express").Router();
const authController = require("../controllers/auth");

router.get("/register", authController.register);

module.exports = router;

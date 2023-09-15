const router = require("express").Router();
const adminController = require("../controllers/admin");

router.post("/login", adminController.login);

module.exports = router;

const router = require("express").Router();
const adminController = require("../controllers/admin");
const handleJWT = require("../middlewares/handleJWT");
const handleRole = require("../middlewares/handleRole");

router.post("/login", adminController.login);

router.use(handleJWT, handleRole);

router.post("/user/locked", adminController.lockedUser);

module.exports = router;

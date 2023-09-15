const router = require("express").Router();
const authController = require("../controllers/auth");
const handleJWT = require("../middlewares/handleJWT");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/refreshToken", authController.refreshToken);

//verify jwt
router.use(handleJWT);
router.post("/change-password", authController.changePassword);

module.exports = router;

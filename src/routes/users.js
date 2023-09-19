const router = require("express").Router();
const userController = require("../controllers/users");
const handleJWT = require("../middlewares/handleJWT");
const handleRole = require("../middlewares/handleRole");
const { upload } = require("../middlewares/handleUpload");
const handleCheckbody = require("../middlewares/handleCheckbody");

router.get("/detail/:id", userController.getDetailUser);

router.use(handleJWT);
router.get("/me", userController.getMe);
router.post(
  "/update",

  upload("avatar").single("avatar"),
  handleCheckbody([
    "username",
    "password",
    "refreshToken",
    "locked",
    "created_at",
    "rank_user",
    "id",
  ]),
  userController.updateUser
);
router.post("/address", userController.createAddress);
router.post("/address/:id", userController.updateAddress);
router.delete("/address/:id", userController.deleteAddress);
router.patch("/address/set-default", userController.setDefaultAddress);

router.use(handleRole);
router.get("/get-all", userController.getAllUser);

module.exports = router;

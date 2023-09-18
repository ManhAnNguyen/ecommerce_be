const router = require("express").Router();
const userController = require("../controllers/users");
const handleJWT = require("../middlewares/handleJWT");

router.get("/detail/:id", userController.getDetailUser);

router.use(handleJWT);
router.get("/me", userController.getMe);
router.post("/address", userController.createAddress);
router.post("/address/:id", userController.updateAddress);
router.delete("/address/:id", userController.deleteAddress);
router.patch("/address/set-default", userController.setDefaultAddress);

module.exports = router;

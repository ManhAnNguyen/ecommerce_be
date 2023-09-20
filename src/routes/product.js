const router = require("express").Router();
const productController = require("../controllers/product");
const handleCheckbody = require("../middlewares/handleCheckbody");
const handleJWT = require("../middlewares/handleJWT");
const handleRole = require("../middlewares/handleRole");
const { upload } = require("../middlewares/handleUpload");

router.get("/", productController.get);

router.use(handleJWT, handleRole);
router.post("/", upload("products").single("image"), productController.create);
router.post("/hidden", productController.hiddenProduct);

router.post(
  "/:id",
  upload("products").single("image"),
  handleCheckbody(["hidden", "id"]),
  productController.update
);

module.exports = router;

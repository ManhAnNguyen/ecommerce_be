const handleRole = require("../middlewares/handleRole");
const categoryController = require("../controllers/category");
const handleJWT = require("../middlewares/handleJWT");
const router = require("express").Router();

router.get("/", categoryController.get);

router.use(handleJWT, handleRole);

router.post("/", categoryController.create);
router.delete("/", categoryController.deleteCategory);

module.exports = router;

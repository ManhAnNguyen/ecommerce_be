const router = require("express").Router();
const orderController = require("../controllers/order");

router.post("/", orderController.create);

router.get("/", orderController.get);

module.exports = router;

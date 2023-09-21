const router = require("express").Router();
const orderController = require("../controllers/order");
const handleRole = require("../middlewares/handleRole");

router.post("/", orderController.create);

router.get("/", orderController.get);
router.post("/cancel-order", orderController.cancelOrder);
router.post("/retrieve-cancel-order", orderController.retrieveCancelOrder);
router.post("/ship", orderController.confirmShip);

router.use(handleRole);

router.post("/change-status", orderController.changeStatus);

module.exports = router;

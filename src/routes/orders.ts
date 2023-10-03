import { Router } from "express";
import handleRole from "../middlewares/handleRole";
import {
  create,
  get,
  cancelOrder,
  retrieveCancelOrder,
  changeStatus,
  confirmShip,
} from "../controllers/orders";
import handleJwt from "../middlewares/handleJWT";

const router = Router();

router.use(handleJwt);
router.post("/", create);

router.get("/", get);
router.post("/cancel-order", cancelOrder);
router.post("/retrieve-cancel-order", retrieveCancelOrder);
router.post("/ship", confirmShip);

router.use(handleRole);

router.post("/change-status", changeStatus);

export default router;

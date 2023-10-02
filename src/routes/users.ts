import { Router } from "express";
import handleRole from "../middlewares/handleRole";
import handleJwt from "../middlewares/handleJWT";
import handleUpload from "../middlewares/handleUpload";
import handleCheckbody from "../middlewares/handleCheckbody";
import {
  getDetailUser,
  getAllUser,
  getMe,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  updateUser,
} from "../controllers/users";
import {
  addBankUser,
  removeBankUser,
  setDefaultBank,
} from "../controllers/banks";

const router = Router();

router.get("/detail/:id", getDetailUser);

router.use(handleJwt);
router.get("/me", getMe);
router.post(
  "/update",

  handleUpload("avatar").single("avatar"),
  handleCheckbody([
    "password",
    "refreshToken",
    "locked",
    "created_at",
    // "rank_user",
    "id",
  ]),
  updateUser
);
router.post("/address", createAddress);
router.post("/address/:id", updateAddress);
router.delete("/address/:id", deleteAddress);
router.patch("/address/set-default/:id", setDefaultAddress);
router.post("/bank", addBankUser);
router.delete("/bank", removeBankUser);
router.post("/bank/set-default", setDefaultBank);

router.use(handleRole);
router.get("/get-all", getAllUser);
export default router;

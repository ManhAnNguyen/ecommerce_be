import { Router } from "express";
import handleRole from "../middlewares/handleRole";
import handleJwt from "../middlewares/handleJWT";
import { getDetailUser, getAllUser } from "../controllers/users";

const router = Router();
router.get("/detail/:id", getDetailUser);

router.use(handleJwt);
// router.get("/me", getMe);
// router.post(
//   "/update",

//   upload("avatar").single("avatar"),
//   handleCheckbody([
//     "username",
//     "password",
//     "refreshToken",
//     "locked",
//     "created_at",
//     "rank_user",
//     "id",
//   ]),
//   updateUser
// );
// router.post("/address", createAddress);
// router.post("/address/:id", updateAddress);
// router.delete("/address/:id", deleteAddress);
// router.patch("/address/set-default", setDefaultAddress);
// router.post("/bank", addBankUser);
// router.delete("/bank", removeBankUser);
// router.post("/bank/set-default", setDefaultBank);

router.use(handleRole);
router.get("/get-all", getAllUser);
export default router;

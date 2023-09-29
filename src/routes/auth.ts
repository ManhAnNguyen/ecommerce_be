import { Router } from "express";
import {
  register,
  login,
  refreshToken,
  logout,
  changePassword,
} from "../controllers/auth";
import handleJwt from "../middlewares/handleJWT";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/refreshToken", refreshToken);
router.delete("/logout", logout);

router.use(handleJwt);
router.post("/change-password", changePassword);

export default router;

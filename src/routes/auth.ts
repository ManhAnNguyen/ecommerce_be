import { Router } from "express";
import {
  register,
  login,
  refreshToken,
  logout,
  changePassword,
} from "../controllers/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/refreshToken", refreshToken);
router.delete("/logout", logout);

router.post("/change-password", changePassword);

export default router;

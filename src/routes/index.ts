import { Router } from "express";
import authRoutes from "./auth";
import adminRoutes from "./admin";
import addressRoutes from "./address";

const router = Router();

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/address", addressRoutes);

export default router;
